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

package tech.mlsql.website.console.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

import java.nio.charset.StandardCharsets;

public class Base64Utils {

    public static String[] getEmailAndPwd(String basicAuth) {
        String encodedTxt = StringUtils.substringAfter(basicAuth, "Basic ");
        String decodeUserPwd = new String(Base64.decodeBase64(encodedTxt), StandardCharsets.UTF_8);

        String email = StringUtils.substringBefore(decodeUserPwd, ":");
        String pwd = StringUtils.substringAfter(decodeUserPwd, ":");
        return new String[]{email, pwd};
    }

    public static String[] getUserAndPwd(String basicAuth) {
        String encodedTxt = StringUtils.substringAfter(basicAuth, "Basic ");
        String decodeUserPwd = new String(Base64.decodeBase64(encodedTxt), StandardCharsets.UTF_8);

        String user = StringUtils.substringBefore(decodeUserPwd, ":");
        String pwd = StringUtils.substringAfter(decodeUserPwd, ":");
        return new String[]{user, pwd};
    }

}
