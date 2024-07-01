terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    bucket = "tiidi"
    key    = "the-wise-app/terraform.tfstate"
    region = "us-east-2"
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "web" {
  image  = "docker-20-04"
  name   = "the-wise-app"
  region = "nyc3"
  size   = "s-1vcpu-1gb"
  ssh_keys = [var.ssh_fingerprint]

  provisioner "remote-exec" {
    inline = [
      "docker pull ${var.docker_image}",
      "docker run -d -p ${var.port}:${var.port} ${var.docker_image}"
    ]
  }
}
