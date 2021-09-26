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

package tech.mlsql.website.console.exception;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class ExceptionUtils {

    public static String getRootCause(Throwable t) {
        Throwable origin = t;
        while (t != null) {
            if (t.getCause() == null) {
                String msg = t.getMessage();
                if (msg == null) {
                    msg = t.toString();
                }
                return msg;
            }
            t = t.getCause();
        }
        if (origin == null) {
            return "";
        }
        return origin.getMessage();
    }

    public static String getRootCause(String ex) {
        if (ex == null || ex.isEmpty()) {
            return "";
        }
        List<String> list = Arrays.asList(ex.split("caused by: \n"));
        List<String> subList = Arrays.asList(list.get(list.size() - 1).split("\n"));
        String regex = (".*([a-zA-Z]*[.][a-zA-Z]*[:][0-9]*\\))");

        StringBuilder rootCause = new StringBuilder();
        for (String term : subList) {
            if (Pattern.matches(regex, term)) break;
            if (rootCause.toString().isEmpty() || rootCause.toString().startsWith(" ")) {
                rootCause.append(term);
            }
        }
        return rootCause.toString();
    }


}
