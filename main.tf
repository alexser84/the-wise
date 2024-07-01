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

# Configuración del dominio y los registros DNS
resource "digitalocean_domain" "domain" {
  name = "thewise.cl"
}

resource "digitalocean_record" "www" {
  domain = digitalocean_domain.domain.name
  type   = "CNAME"
  name   = "www"
  value  = "@"
}

resource "digitalocean_record" "a" {
  domain = digitalocean_domain.domain.name
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.web.ipv4_address
}

# Configuración del certificado SSL gestionado
resource "digitalocean_certificate" "example" {
  name           = "thewise-cl-certificate"
  type           = "lets_encrypt"
  domains        = ["thewise.cl", "www.thewise.cl"]
  wildcard       = false
  lets_encrypt {
    product_name = "Custom"
  }
}

# Outputs para facilitar la integración con otras configuraciones
output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}

output "certificate_id" {
  value = digitalocean_certificate.example.id
}
