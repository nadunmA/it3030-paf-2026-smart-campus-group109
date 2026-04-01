package com.wegroup423.smart_campus.features.auth.repository;









import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Repository;

import com.wegroup423.smart_campus.features.auth.model.User;

import java.util.Optional;



@Repository

public interface UserRepository extends MongoRepository<User, String> {



    Optional<User> findByEmail(String email);



    Optional<User> findByGoogleId(String googleId);



    boolean existsByEmail(String email);

}