variable "aws_region" {
  description = "AWS Region to deploy the infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 Instance Type for Jenkins"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Ubuntu 24.04 LTS AMI ID for us-east-1"
  type        = string
  default     = "ami-04b70fa74e45c3917" 
}

variable "key_name" {
  description = "Name of the existing AWS EC2 Key Pair"
  type        = string
  default     = "paf-key"  
}