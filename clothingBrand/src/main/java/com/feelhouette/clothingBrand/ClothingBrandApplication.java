package com.feelhouette.clothingBrand;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import reactor.core.publisher.Hooks;

@SpringBootApplication
public class ClothingBrandApplication {

	public static void main(String[] args) {

		SpringApplication.run(ClothingBrandApplication.class, args);
		Hooks.enableAutomaticContextPropagation();
	}

}
