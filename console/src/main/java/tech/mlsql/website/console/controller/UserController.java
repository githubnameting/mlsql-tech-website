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

package tech.mlsql.website.console.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tech.mlsql.website.console.bean.dto.*;
import tech.mlsql.website.console.bean.entity.UserInfo;
import tech.mlsql.website.console.bean.req.UserJoinReq;
import tech.mlsql.website.console.exception.BaseException;
import tech.mlsql.website.console.service.UserService;
import tech.mlsql.website.console.support.Permission;
import tech.mlsql.website.console.util.Base64Utils;
import tech.mlsql.website.console.util.JwtUtils;
import tech.mlsql.website.console.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("api")
@Api("The documentation about operations on user")
public class UserController {

    @Autowired
    private UserService userService;

    @Value("${mlsql.website.baize.url}")
    private String baizeUrl;

    @ApiOperation("Sign Up User")
    @PostMapping("/user/join")
    public Response<Integer> signUp(@RequestBody @Validated UserJoinReq userJoinReq, HttpServletRequest request) {
        String user = userJoinReq.getName();
        UserInfo userInfo = userService.createUser(UserInfo.valueOf(userJoinReq));
        request.getSession().setAttribute("username", userInfo.getName());
        // Mailbox verification
        userService.sendEmail(VerifyDTO.valueOf(userJoinReq));
        return new Response<Integer>().data(userInfo.getId());
    }

    @ApiOperation("Verify User and Redirect Baize")
    @GetMapping("/user/verification/{verifyCode}")
    public Response<IdNameDTO> verify(@PathVariable("verifyCode") String jwt, HttpServletResponse response) throws IOException {
        String userName = "";
        try {
            userName = JwtUtils.getClaim(jwt, "username");
            UserInfo user = userService.findUserByName(userName, false);
            if (user == null) {
                throw new BaseException("User Not Exist");
            }
            String password = user.getPassword();
            if (!JwtUtils.verify(jwt, password)) {
                throw new BaseException("Link has Expired");
            }
            userService.activateUser(user);
        } catch (Exception ex) {
            response.sendRedirect("/expired");
        }

        response.sendRedirect("/trial");
        return new Response<IdNameDTO>().data(IdNameDTO.valueOf(1, userName));
    }

    @ApiOperation("Check User Activation")
    @GetMapping("/user/activation")
    @Permission
    public Response<UserActivationDTO> checkActive() {
        String userName = WebUtils.getCurrentLoginUser();
        UserInfo userInfo = userService.findUserByName(userName, false);
        if (userInfo == null) {
            throw new BaseException("User not exist");
        }
        boolean isVerified = userInfo.getIsVerified();
        return new Response<UserActivationDTO>().data(UserActivationDTO.valueOf(isVerified));
    }

    @ApiOperation("Resend Email")
    @PostMapping("/user/resend_email")
    @Permission
    public Response<EmailDTO> resend() {
        String userName = WebUtils.getCurrentLoginUser();
        UserInfo userInfo = userService.findUserByName(userName, false);
        if (userInfo == null) {
            throw new BaseException("User not exist");
        }
        userService.sendEmail(VerifyDTO.valueOf(userInfo));
        return new Response<EmailDTO>().data(EmailDTO.valueOf(userInfo.getEmail()));
    }

    @ApiOperation("User Login")
    @PostMapping("/user/authentication")
    public Response<String> login(@RequestHeader("Authorization") String basicAuth,
                                   HttpServletRequest request) {
        String[] nameAndPwd = Base64Utils.getEmailAndPwd(basicAuth);

        String userName = userService.auth(nameAndPwd[0], nameAndPwd[1]);
        request.getSession().setAttribute("username", userName);
        return new Response<String>().data(userName);
    }

    @ApiOperation("Get User Info")
    @GetMapping("/user/me")
    @Permission
    public Response<UserInfoDTO> getUserInfo() {
        String username = WebUtils.getCurrentLoginUser();
        UserInfo userInfo = userService.findUserByName(username, true);
        if (userInfo == null) {
            throw new BaseException("user not exist");
        }
        return new Response<UserInfoDTO>().data(UserInfoDTO.valueOf(userInfo));
    }

    @ApiOperation("User Logout")
    @DeleteMapping("/user/authentication")
    @Permission
    public Response<String> logout(HttpServletRequest request) {
        String username = WebUtils.getCurrentLoginUser();
        request.getSession().setAttribute("username", "");
        return new Response<String>().data(username);
    }



}
