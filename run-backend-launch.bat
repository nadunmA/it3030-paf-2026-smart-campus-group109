@echo off
title Smart Campus Backend
set "JAVA_HOME=C:\Program Files\Java\jdk-22"
set "MONGO_URI=mongodb+srv://SmartCampus423:djwqubFfE7oYQ4ef@smartcampuscluster423.ektubbf.mongodb.net/?appName=SmartCampusCluster423"
set "GOOGLE_CLIENT_ID=45348808560-5ql4e6gbkjbl3jt41lodoqugb643h1s6.apps.googleusercontent.com"
set "GOOGLE_CLIENT_SECRET=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"
set "JWT_SECRET=MageRahasKeyEkaMeakaThamai2026SmartCampusPAFProject"
set "FRONTEND_URL=http://localhost:5173"
cd /d "C:\Users\Lakin\Downloads\it3030-paf-2026-smart-campus-group423\backend\smart-campus"
"C:\Users\Lakin\.m2\wrapper\dists\apache-maven-3.9.12\59fe215c0ad6947fea90184bf7add084544567b927287592651fda3782e0e798\bin\mvn.cmd" spring-boot:run
echo.
echo Backend stopped. Press any key to close.
pause >nul