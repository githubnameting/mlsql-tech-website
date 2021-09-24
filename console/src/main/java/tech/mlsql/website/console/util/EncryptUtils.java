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

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import tech.mlsql.website.console.exception.BaseException;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

@Slf4j
public class EncryptUtils {

    private static final String KEY_ALGORITHM = "AES";

    private static final String DEFAULT_CIPHER_ALGORITHM = "AES/ECB/PKCS5Padding";

    private static Key key;

    static {
        try {
            String secretKeyHexStr = "1fb511361580867f62c71b08f9db72f3";
            key = toKey(Hex.decodeHex(secretKeyHexStr));
        } catch (DecoderException e) {
            log.error("Load AES key error", e);
            System.exit(1);
        }
    }

    public static byte[] initSecretKey() {
        KeyGenerator kg;
        try {
            kg = KeyGenerator.getInstance(KEY_ALGORITHM);
            kg.init(128);
            SecretKey secretKey = kg.generateKey();
            return secretKey.getEncoded();
        } catch (NoSuchAlgorithmException e) {
            log.error("no such encryption algorithm", e);
            return new byte[0];
        }
    }

    public static String getKey(){
        return Hex.encodeHexString(key.getEncoded());
    }

    private static Key toKey(byte[] key) {
        return new SecretKeySpec(key, KEY_ALGORITHM);
    }

    public static String encrypt(String plainText) {
        byte[] bytes = plainText.getBytes(StandardCharsets.UTF_8);
        byte[] encryptBytes = encrypt(bytes, key, DEFAULT_CIPHER_ALGORITHM);
        return Hex.encodeHexString(encryptBytes);
    }

    private static byte[] encrypt(byte[] data, Key key, String cipherAlgorithm) {
        try {
            Cipher cipher = Cipher.getInstance(cipherAlgorithm);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return cipher.doFinal(data);
        } catch (Exception ex) {
            log.warn("Password Encryption error", ex);
            return data;
        }
    }

    public static String decrypt(String cipherHexText) {
        byte[] cipherBytes;
        try {
            cipherBytes = Hex.decodeHex(cipherHexText);
        } catch (Exception e) {
            throw new BaseException("password encode error");
        }

        byte[] clearBytes = decrypt(cipherBytes, key, DEFAULT_CIPHER_ALGORITHM);
        return new String(clearBytes, StandardCharsets.UTF_8);
    }

    public static byte[] decrypt(byte[] data, Key key, String cipherAlgorithm) {
        try {
            Cipher cipher = Cipher.getInstance(cipherAlgorithm);
            cipher.init(Cipher.DECRYPT_MODE, key);
            return cipher.doFinal(data);
        } catch (Exception ex) {
            throw new BaseException("password decryption error");
        }
    }

    public static void main(String[] args) {
        byte[] keyBytes = initSecretKey();
        String keyString = Arrays.toString(keyBytes);
        System.out.println(keyString);
        Key key = toKey(keyBytes);
        String result = encrypt(keyString);
        System.out.println(result);
    }
}



