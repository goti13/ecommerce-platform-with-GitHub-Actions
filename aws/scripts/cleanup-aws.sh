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
