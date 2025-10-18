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
EOF

# Create cleanup script
cat > aws/scripts/cleanup-aws.sh << 'EOF'
#!/bin/bash

echo "Cleaning up AWS resources..."

# Stop ECS service
aws ecs update-service --cluster ecommerce-cluster --service ecommerce-backend-service --desired-count 0 --region us-east-1 2>/dev/null && echo "Stopped ECS service"

# Delete ECR images
for repo in ecommerce-backend ecommerce-frontend; do
    aws ecr batch-delete-image --repository-name $repo --image-ids "$(aws ecr list-images --repository-name $repo --region us-east-1 --query 'imageIds[*]' --output json)" --region us-east-1 2>/dev/null && echo "Cleared ECR: $repo"
done

echo "AWS cleanup completed"
