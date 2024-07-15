provider "digitalocean" {
  token = var.do_token
}

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

resource "digitalocean_vpc" "vpc" {
  name   = "the-wise-vpc"
  region = "nyc3"
}

resource "digitalocean_firewall" "firewall" {
  name    = "the-wise-firewall"

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = var.port
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol             = "tcp"
    port_range           = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  droplet_ids = [digitalocean_droplet.web.id]
}

resource "digitalocean_droplet" "web" {
  image  = "ubuntu-20-04-x64"
  name   = "the-wise-app"
  region = "nyc3"
  size   = "s-1vcpu-1gb"
  ssh_keys = [var.ssh_fingerprint]
  vpc_uuid = digitalocean_vpc.vpc.id

  connection {
    type        = "ssh"
    user        = "root"
    private_key = var.private_key
    host        = self.ipv4_address
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y docker.io",
      "docker pull ${var.docker_image}",
      "docker run -d -p ${var.port}:${var.port} ${var.docker_image}"
    ]
  }
}

resource "digitalocean_loadbalancer" "lb" {
  name   = "the-wise-lb"
  region = "nyc3"
  forwarding_rule {
    entry_protocol = "http"
    entry_port     = 80
    target_protocol = "http"
    target_port     = var.port
  }

  healthcheck {
    port     = var.port
    protocol = "http"
    path     = "/"
  }

  droplet_ids = [digitalocean_droplet.web.id]
  vpc_uuid    = digitalocean_vpc.vpc.id
}

resource "digitalocean_domain" "domain" {
  name = "thewise.cl"
}

resource "digitalocean_record" "www" {
  domain = digitalocean_domain.domain.name
  type   = "A"
  name   = "www"
  value  = digitalocean_droplet.web.ipv4_address
  ttl    = 3600
}

resource "digitalocean_record" "root" {
  domain = digitalocean_domain.domain.name
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.web.ipv4_address
  ttl    = 3600
}

resource "digitalocean_record" "autodiscover" {
  domain = digitalocean_domain.domain.name
  type   = "CNAME"
  name   = "autodiscover"
  value  = "autodiscover.outlook.com."
  ttl    = 3600
}

resource "digitalocean_record" "mx" {
  domain = digitalocean_domain.domain.name
  type   = "MX"
  name   = "@"
  value  = "thewise-cl.mail.protection.outlook.com."
  priority = 10
  ttl    = 3600
}

resource "digitalocean_record" "txt" {
  domain = digitalocean_domain.domain.name
  type   = "TXT"
  name   = "@"
  value  = "v=spf1 include:spf.protection.outlook.com -all"
  ttl    = 3600
}

resource "digitalocean_certificate" "example" {
  name           = "thewise-cl-certificate"
  type           = "lets_encrypt"
  domains        = ["thewise.cl", "www.thewise.cl"]
}

output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}

output "certificate_id" {
  value = digitalocean_certificate.example.id
}
