variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
}

variable "ssh_fingerprint" {
  description = "SSH key fingerprint for DigitalOcean"
  type        = string
}

variable "docker_image" {
  description = "Docker image to deploy"
  type        = string
}

variable "port" {
  description = "Port for the application"
  type        = string
}
