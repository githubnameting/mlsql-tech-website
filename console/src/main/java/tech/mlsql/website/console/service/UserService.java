/*
 * Copyright (C) 2021 Kyligence Inc. All rights reserved.
 *
 * http://kyligence.io
 *
 * This software is the confidential and proprietary information of
 * Kyligence Inc. ("Confidential Information"). You shall not disclose
 * such Confidential Information and shall use it only in accordance
 * with the terms of the license agreement you entered into with
 * Kyligence Inc.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package tech.mlsql.website.console.service;

import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import tech.mlsql.website.console.bean.dto.UserRegisterDTO;
import tech.mlsql.website.console.bean.entity.EmailTemplate;
import tech.mlsql.website.console.bean.entity.UserInfo;
import tech.mlsql.website.console.dao.TemplateRepository;
import tech.mlsql.website.console.dao.UserInfoRepository;
import tech.mlsql.website.console.exception.BaseException;
import tech.mlsql.website.console.util.EncryptUtils;
import tech.mlsql.website.console.util.JacksonUtils;
import tech.mlsql.website.console.util.JwtUtils;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Service
public class UserService {

    @Value("${spring.mail.fromMail}")
    private String from;

    @Value("${mlsql.website.jwt.timeout:1800}")
    private long timeout;

    @Value("${mlsql.website.baize.url}")
    private String baizeUrl;

    @Value("${mlsql.website.url}")
    private String hostUrl;

    @Autowired
    private JavaMailSenderImpl emailSender;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private TemplateRepository templateRepository;

    private Map<String, EmailTemplate> emailTemplates;

    public String auth(String user, String pwd) {
        UserInfo userInfo = findUserByName(user, true);

        if (userInfo == null) {
            throw new BaseException("User Not Exist");
        }

        String encryptPwd = EncryptUtils.encrypt(pwd);

        if (!userInfo.getPassword().equals(encryptPwd)) {
            throw new BaseException("Wrong Username or Password");
        }

        return userInfo.getName();
    }

    public void sendRegistrationVerifyEmail(UserInfo userInfo) {
        EmailTemplate template = getEmailTemplate(EmailTemplate.Usage.registerVerify);
        String jwt = JwtUtils.create(userInfo.getName(), userInfo.getPassword(), timeout);
        sendEmail(userInfo.getEmail(), template.getSubject(), template.formatContent(userInfo.getName(), hostUrl, jwt));

    }

    public void sendResetPasswordEmail(UserInfo userInfo){
        EmailTemplate template = getEmailTemplate(EmailTemplate.Usage.resetPasswordConfirm);
        String jwt = JwtUtils.create(userInfo.getName(), userInfo.getPassword(), timeout);
        sendEmail(userInfo.getEmail(), template.getSubject(), template.formatContent(userInfo.getName(), hostUrl, jwt));
    }

    @Async("taskExecutor")
    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        try {
            emailSender.send(message);
        } catch (MailSendException e) {
            log.error("Send email error, from {} to {}", from, to);
            throw e;
        } catch (Exception e) {
            log.error("Send email error");
            throw e;
        }

    }

    public UserInfo createUser(UserInfo userInfo) {
        UserInfo user = userInfoRepository.findOneByNameOrEmail(userInfo.getName(), userInfo.getEmail());
        if (user != null) {
            if (userInfo.getName().equals(user.getName())) {
                throw new BaseException("name already exist");
            } else if (userInfo.getEmail().equals(user.getEmail())) {
                throw new BaseException("email already exist");
            }
        }

        return userInfoRepository.save(userInfo);
    }

    public UserInfo findUserByName(String userName, boolean isVerified) {
        return userInfoRepository.findOneByName(userName);
    }

    public UserInfo findUserByEmail(String email, boolean isVerified) {
        return userInfoRepository.findOneByEmail(email);
    }

    @Transactional
    public void activateUser(UserInfo user) {
        user.setIsVerified(true);
        userInfoRepository.save(user);

        String userJoinStr = JacksonUtils.writeJson(UserRegisterDTO.valueOf(user));
        String registration = EncryptUtils.encrypt(userJoinStr);
        registerBaizeUser(registration);
    }

    @Transactional
    public void updateUserPassword(UserInfo userInfo, String password) {
        userInfo.setPassword(EncryptUtils.encrypt(password));
        userInfoRepository.save(userInfo);

        if (! userInfo.getIsVerified()) return;
        String resetPasswordStr = JacksonUtils.writeJson(UserRegisterDTO.valueOf(userInfo));
        String resetPasswordHeader = EncryptUtils.encrypt(resetPasswordStr);
        resetBaizeUserPassword(resetPasswordHeader);
    }

    private Integer registerBaizeUser(String registration) {

        String url = baizeUrl + "/api/user/register";

        HttpHeaders headers = new HttpHeaders();
        headers.set("registration", registration);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.ALL));
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        ResponseEntity<Integer> response;

        try {
            response = restTemplate.postForEntity(url, request, Integer.class);
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new BaseException(String.valueOf(response.getBody()));
            }
        } catch (Exception ex) {
            throw new BaseException("Baize Access Denied");
        }
        return response.getBody();
    }

    private void resetBaizeUserPassword(String resetPasswordHeader){

        String url = baizeUrl + "/api/user/reset_password";

        HttpHeaders headers = new HttpHeaders();
        headers.set("reset-password", resetPasswordHeader);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.ALL));
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<Integer> response = restTemplate.postForEntity(url, request, Integer.class);
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new BaseException(String.valueOf(response.getBody()));
            }
        } catch (Exception ex) {
            throw new BaseException("Baize Access Denied");
        }
    }

    private EmailTemplate getEmailTemplate(String usage) {
        if (emailTemplates == null) {
            emailTemplates = Maps.newHashMap();
            templateRepository.findAll().forEach(t -> emailTemplates.put(t.getUsage(), t));
        }
        return emailTemplates.get(usage);
    }
}
