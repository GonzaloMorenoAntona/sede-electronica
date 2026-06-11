package com.sede.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.*;

import java.util.Map;

@Service
public class RecaptchaService {

    @Value("${hcaptcha.secret}")
    private String secretKey;

    private static final String VERIFY_URL = "https://api.hcaptcha.com/siteverify";

    public boolean verificar(String token) {
        try {
            RestTemplate rest = new RestTemplate();
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("secret", secretKey);
            params.add("response", token);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            ResponseEntity<Map> resp = rest.postForEntity(
                    VERIFY_URL,
                    new HttpEntity<>(params, headers),
                    Map.class
            );

            Map body = resp.getBody();
            return body != null && Boolean.TRUE.equals(body.get("success"));
        } catch (Exception e) {
            return false;
        }
    }
}
