 # Copyright (C) 2022 Eunimart Omnichannel Pvt Ltd. (www.eunimart.com)
 # All rights reserved.
 # This program is free software: you can redistribute it and/or modify
 # it under the terms of the GNU Lesser General Public License v3.0 as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 # This program is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU Lesser General Public License v3.0 for more details.
 # You should have received a copy of the GNU Lesser General Public License v3.0
 # along with this program.  If not, see <https://www.gnu.org/licenses/lgpl-3.0.html/>.
 # Name the node stage "builder"
FROM node:16 AS builder

ARG PORT
# NODE_ENV = dev, prod
ARG NODE_ENV

ARG JUSPAY_SECRET_KEY_PATH
ARG JUSPAY_BASE_URL
ARG JUSPAY_MERCHANT_ID
ARG JUSPAY_API_KEY
ARG JUSPAY_WEBHOOK_USERNAME
ARG JUSPAY_WEBHOOK_PASSWORD

ARG FIREBASE_ADMIN_SERVICE_ACCOUNT

ARG ONDC_BASE_API_URL

ARG DOMAIN
ARG CITY
ARG COUNTRY

ARG BAP_ID
ARG BAP_URL

ARG PROTOCOL_BASE_URL

ARG DB_CONNECTION_STRING

ARG BAP_PRIVATE_KEY
ARG BAP_PUBLIC_KEY
ARG BAP_UNIQUE_KEY_ID
ARG REGISTRY_BASE_URL
ARG ENV_TYPE
ARG BAP_FINDER_FEE_TYPE
ARG BAP_FINDER_FEE_AMOUNT
ARG SSE_TIMEOUT

ENV PORT ${PORT}
ENV NODE_ENV ${NODE_ENV}

ENV JUSPAY_SECRET_KEY_PATH ${JUSPAY_SECRET_KEY_PATH}
ENV JUSPAY_BASE_URL ${JUSPAY_BASE_URL}
ENV JUSPAY_MERCHANT_ID ${JUSPAY_MERCHANT_ID}
ENV JUSPAY_API_KEY ${JUSPAY_API_KEY}
ENV JUSPAY_WEBHOOK_USERNAME ${JUSPAY_WEBHOOK_USERNAME}
ENV JUSPAY_WEBHOOK_PASSWORD ${JUSPAY_WEBHOOK_PASSWORD}

ENV FIREBASE_ADMIN_SERVICE_ACCOUNT ${FIREBASE_ADMIN_SERVICE_ACCOUNT}

ENV ONDC_BASE_API_URL ${ONDC_BASE_API_URL}

ENV DOMAIN ${DOMAIN}
ENV CITY ${CITY}
ENV COUNTRY ${COUNTRY}
ENV BAP_ID ${BAP_ID}
ENV BAP_URL ${BAP_URL}
ENV PROTOCOL_BASE_URL ${PROTOCOL_BASE_URL}

ENV DB_CONNECTION_STRING ${DB_CONNECTION_STRING}

ENV BAP_PRIVATE_KEY ${BAP_PRIVATE_KEY}
ENV BAP_PUBLIC_KEY ${BAP_PUBLIC_KEY}
ENV BAP_UNIQUE_KEY_ID ${BAP_UNIQUE_KEY_ID}
ENV REGISTRY_BASE_URL ${REGISTRY_BASE_URL}
ENV ENV_TYPE ${ENV_TYPE}

ENV BAP_FINDER_FEE_TYPE ${BAP_FINDER_FEE_TYPE}
ENV BAP_FINDER_FEE_AMOUNT ${BAP_FINDER_FEE_AMOUNT}
ENV SSE_TIMEOUT ${SSE_TIMEOUT}

# Set working directory
WORKDIR /build
COPY package*.json yarn.lock ./

# install node modules
RUN yarn

# Copy all files from current directory to working dir in image
COPY . .
CMD [ "yarn", "start" ]
