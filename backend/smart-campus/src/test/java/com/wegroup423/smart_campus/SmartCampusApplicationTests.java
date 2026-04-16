package com.wegroup423.smart_campus;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = "spring.data.mongodb.uri=mongodb://localhost:27017/smart-campus-test")
@ActiveProfiles("test")
class SmartCampusApplicationTests {

	@Test
	void contextLoads() {
	}

}