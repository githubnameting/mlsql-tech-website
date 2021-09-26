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

package tech.mlsql.website.console.support;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tech.mlsql.website.console.exception.AccessDeniedException;
import tech.mlsql.website.console.service.UserService;
import tech.mlsql.website.console.util.Base64Utils;
import tech.mlsql.website.console.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Aspect
@Component
public class PermissionChecker {

    @Autowired
    private UserService userService;

    @Around("@annotation(tech.mlsql.website.console.support.Permission)")
    public Object check(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = WebUtils.getRequest();
        HttpServletResponse response = WebUtils.getResponse();

        // 1. check auth header
        String basicAuth = request.getHeader("Authorization");
        if (basicAuth != null) {
            String[] userAndPwd = Base64Utils.getUserAndPwd(basicAuth);

            try {
                userService.auth(userAndPwd[0], userAndPwd[1]);
                WebUtils.setCurrentLoginUser(userAndPwd[0]);
            } catch (Exception e) {
                throw new AccessDeniedException("Access denied");
            }
            return joinPoint.proceed();
        }

        // 2. check session
        Object sessionUser = request.getSession().getAttribute("username");
        if (sessionUser != null && StringUtils.isNotEmpty(sessionUser.toString())) {
            WebUtils.setCurrentLoginUser(sessionUser.toString());
            return joinPoint.proceed();
        }

        throw new AccessDeniedException("Access denied");
    }

}
