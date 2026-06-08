# ─────────────────────────────────────────────────────────────────
# Smart Campus – Production Dockerfile
# Language : Java 21
# Framework: Spring Boot 3.5.12
# Build Tool: Maven 3.9.12 (via wrapper)
# Port     : 8080
# ─────────────────────────────────────────────────────────────────

# ══════════════════════════════════════════════════════════════════
# STAGE 1 — BUILD
# Use full JDK image to compile and package the application
# ══════════════════════════════════════════════════════════════════
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper files first to leverage Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Pre-download all dependencies (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy application source code
COPY src ./src

# Package the application; skip tests (tests run in CI pipeline)
RUN ./mvnw package -DskipTests -B

# ══════════════════════════════════════════════════════════════════
# STAGE 2 — RUNTIME
# Use slim JRE-only image — strips compiler toolchain from final image
# Critical for t3.micro: reduces image size by ~200–300 MB
# ══════════════════════════════════════════════════════════════════
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create a non-root system user — never run apps as root in production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Assign ownership to the non-root user
RUN chown appuser:appgroup app.jar

USER appuser

# Expose the default Spring Boot port
EXPOSE 8080

# Health check using Spring Boot Actuator (/actuator/health)
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# JVM tuning flags for t3.micro (2 vCPU / 1 GB RAM):
#   -XX:+UseContainerSupport   → respect container memory limits
#   -XX:MaxRAMPercentage=75.0  → cap heap at 75% of container RAM
#   -XX:+UseG1GC               → G1 GC performs well under low memory
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+UseG1GC", \
  "-jar", "app.jar"]