# ![Perfect Match](./images/application-title.png "Application logo") #

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A game that challenges you to draw a perfect circle.
[Click here to access the application](https://yanncarvalho.github.io/perfect-match/).

[![Tests](https://github.com/yanncarvalho/perfect-match/actions/workflows/tests.yml/badge.svg)](https://github.com/yanncarvalho/perfect-match/actions/workflows/tests.yml)
[![Docker push](https://github.com/yanncarvalho/perfect-match/actions//workflows/docker.yml/badge.svg?branch=main)](https://github.com/yanncarvalho/perfect-match/actions//workflows/docker.yml)

## Built with ##

- Angular 14
- Tailwind 3.0
- TypeScript 4.9

## How to run ##

### Using docker image ###

To run the application with docker run the command:

``` sh
docker run -p [port]:80 yanncarvalho/perfect-match:latest
```

### Run without docker container ###

To run the application run the command:

``` sh
  npm install &&
  npm run serve
```

## How it works ##

It is calculated the Centroid of the figure; then the Eucleadian Distance of each point in relation to the Centroid is calculated, finally the Standard Deviation is calculated and a percentage is generated from it.

## Author ##

Made by [Yann Carvalho](https://www.linkedin.com/in/yann-carvalho-764abab6/).

## Licensing ##

What about my country is licensed under the Apache 2.0 License. See [LICENSE](LICENSE) for the full license text.
