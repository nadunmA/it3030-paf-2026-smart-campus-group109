output "jenkins_server_public_ip" {
  description = "Public IP address of the Jenkins EC2 instance"
  value       = aws_instance.jenkins_server.public_ip
}

output "jenkins_url" {
  description = "URL to access the Jenkins Dashboard"
  value       = "http://${aws_instance.jenkins_server.public_ip}:8080"
}