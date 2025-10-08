FROM ubuntu:22.04
LABEL authors="theal"

ENTRYPOINT ["top", "-b"]

# ================================
# Stage 1: Build the application
# ================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only pom.xml first (for dependency caching)
COPY pom.xml ./

# Download dependencies (better build caching)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Package the Spring Boot application (skip tests for speed, remove -DskipTests if you want tests to run)
RUN mvn clean package -DskipTests

# ================================
# Stage 2: Run the application
# ================================
FROM eclipse-temurin:21-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (default Spring Boot port)
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java","-jar","app.jar"]