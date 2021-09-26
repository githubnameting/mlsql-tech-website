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

package tech.mlsql.website.console.bean.entity;

import lombok.Data;
import tech.mlsql.website.console.bean.req.UserJoinReq;
import tech.mlsql.website.console.util.EncryptUtils;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "user_info")
@Data
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "company", nullable = false)
    private String company;

    @Column(name = "telephone", nullable = false)
    private String telephone;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified;

    @Column(name = "create_time", nullable = false)
    private Timestamp createTime;

    public static UserInfo valueOf(UserJoinReq userJoinReq) {
        UserInfo userInfo = new UserInfo();
        userInfo.name = userJoinReq.getName();
        userInfo.password = EncryptUtils.encrypt(userJoinReq.getPassword());
        userInfo.company = userJoinReq.getCompany();
        userInfo.telephone = userJoinReq.getTelephone();
        userInfo.email = userJoinReq.getEmail();
        userInfo.isVerified = false;
        userInfo.createTime = new Timestamp(System.currentTimeMillis());
        return userInfo;
    }
}
