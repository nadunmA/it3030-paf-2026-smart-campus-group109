# Security Group
resource "aws_security_group" "jenkins_sg" {
  name        = "jenkins-security-group-smart-campus"
  description = "Allow SSH and Jenkins Dashboard traffic"
  vpc_id      = aws_vpc.custom_vpc.id 

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# t3.micro EC2 Instance 
resource "aws_instance" "jenkins_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.public_subnet.id 
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]

  # Storage 20GB
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "Smart-Campus-Jenkins-Controller"
  }
}