# olx-asp

Create docker hub repository - publish
```
docker build -t olx-asp-api . 
docker run -it --rm -p 5817:8080 --name olx-asp_container olx-asp-api
docker run -d --restart=always --name olx-asp_container -p 5817:8080 olx-asp-api
docker run -d --restart=always -v d:/volumes/olx-asp/images:/app/images --name olx-asp_container -p 5817:8080 olx-asp-api
docker run -d --restart=always -v /volumes/olx-asp/images:/app/images --name olx-asp_container -p 5817:8080 olx-asp-api
docker ps -a
docker stop olx-asp_container
docker rm olx-asp_container

docker images --all
docker rmi olx-asp-api

docker login
docker tag olx-asp-api:latest sashok9203/olx-asp-api:latest
docker push sashok9203/olx-asp-api:latest

docker pull sashok9203/olx-asp-api:latest
docker ps -a
docker run -d --restart=always --name olx-asp_container -p 5817:8080 sashok9203/olx-asp-api

docker run -d --restart=always -v /volumes/olx-asp/images:/app/images --name olx-asp_container -p 5817:8080 sashok9203/olx-asp-api


docker pull sashok9203/olx-asp-api:latest
docker images --all
docker ps -a
docker stop olx-asp_container
docker rm olx-asp_container
docker run -d --restart=always --name olx-asp_container -p 5817:8080 sashok9203/olx-asp-api
```

```nginx options /etc/nginx/sites-available/default
server {
    server_name   olxapi.itstep.click *.olxapi.itstep.click;
    location / {
       proxy_pass         http://localhost:5817;
       proxy_http_version 1.1;
       proxy_set_header   Upgrade $http_upgrade;
       proxy_set_header   Connection keep-alive;
       proxy_set_header   Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header   X-Forwarded-Proto $scheme;
    }
}


sudo systemctl restart nginx
certbot
```
