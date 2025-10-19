#!/bin/bash

echo "Setting up AWS infrastructure for E-Commerce Platform..."

# Create ECR repositories
aws ecr create-repository --repository-name ecommerce-backend --region us-east-1 || echo "Backend ECR exists"
aws ecr create-repository --repository-name ecommerce-frontend --region us-east-1 || echo "Frontend ECR exists"

# Create S3 bucket for frontend
BUCKET_NAME="ecommerce-frontend-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME --region us-east-1
echo "Frontend S3 bucket: $BUCKET_NAME"

# Configure bucket for static website
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

echo "AWS infrastructure ready!"
echo "Update GitHub Secrets with:"
echo "S3_BUCKET_NAME: $BUCKET_NAME"

