
# E-Commerce with GitHub Actions


Capstone Project: E-Commerce Application Cl/ CD Pipeline

Project Overview: Automated Pipeline for an E-Commerce Platform


Hypothetical Use Case:

You are tasked with developing and maintaining an e-commerce platform. This platform has two primary components:


- E-Commerce API: Backend service handling product listings, user accounts, and order processing.

- E-Commerce Frontend: A web application for users to browse products, manage their accounts, and place orders.

The goal is to automate the integration and deployment proces for both components using Gitub Actions, ensuring continuous delivery and integration.

Project Tasks:

Task 1: Project Setup

- Create a new GitHub repository named 'ecommerce-platform'.


- Inside the repository, create two directories: 'api for the backend and "webapp' for the frontend.


Task 2: Initialize GitHub Actions


-  Initialize a Git repository and add your initial project structure.

-  Create ' github/workflows* directory in your repository for GitHub Actions.

Task 3: Backend API Setup

- In the 'api directory, set up a simple Node.js/Express application that handles basic e-commerce operations.

- Implement unit tests for your AP!.

Task 4: Frontend Web Application Setup

- In the webapp' directory, create a simple React application that interacts with the backend API.

-  Ensure the frontend has basic features like product listing, user login, and order placement.

Task 5: Continuous Integration Workflow

- Write a GitHub Actions workflow for the backend and frontend that:

- Installs dependencies.

- Runs tests.

- Builds the application

Task 6: Docker Integration

- Create Dockerfiles for both the backend and frontend

- Modify your GitHub Actions workflows to build Docker images.


Task 7: Deploy to Cloud

- Choose a cloud platform for deployment (AWS, Azure, or GCP).

- Configure GitHub Actions to deploy the Docker images to the chosen cloud platform.

-  Use GitHub Secrets to securely store and access cloud credentials.

Task 8: Continuous Deployment

-  Configure your workflows to deploy updates automatically to the cloud environment when changes are pushed to the main branch.

Task 9: Performance and Security

- Implement caching in your workflows to optimize build times.

- Ensure all sensitive data, including API kevs and database credentials, are secured using GitHub Secrets
Task 10: Project Documentation

- Document your project setup, workflow details, and instructions for local development in a README. md fle.


_______________________________________________________________________________________________________________________

                                              PROJECT IMPLEMENTATION
_______________________________________________________________________________________________________________________



Phase 1: Initial Setup

Step 1.1: Create Project Structure

```
mkdir ecommerce-platform
cd ecommerce-platform

# Initialize git repository
git init

# Create the complete directory structure
mkdir -p .github/workflows api webapp/src webapp/public aws/scripts

# Verify structure
find . -type f


```

```
ecommerce-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI Pipeline
│       └── deploy.yml                # AWS Deployment
│
├── api/                             # Backend API
│   ├── __tests__/
│   │   └── app.test.js              # Backend Tests
│   ├── aws/
│   │   └── scripts/
│   │       ├── setup-aws.sh         # AWS Setup
│   │       └── cleanup-aws.sh       # AWS Cleanup
│   ├── Dockerfile                   # Backend Container
│   ├── package.json                 # Dependencies
│   ├── app.test.js                  # Additional Tests
│   └── server.js                    # Express Server
│
├── webapp/                          # Frontend React App
│   ├── public/
│   │   └── index.html               # HTML Template
│   ├── src/
│   │   ├── App.css                  # Styles
│   │   ├── App.js                   # React Components
│   │   └── index.js                 # React Entry
│   ├── Dockerfile                   # Frontend Container
│   └── package.json                 # Dependencies
│
├── aws/                             # AWS Infrastructure
│   └── scripts/
│       ├── setup-aws.sh             # AWS Setup
│       └── cleanup-aws.sh           # AWS Cleanup
│
├── .gitignore                       # Git Ignore Rules
└── README.md                        # Documentation
```

Step 1.2: Create Essential Files

```
# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Production builds
webapp/build/
dist/

# Environment variables
.env
.env.local

# Logs
*.log

# Coverage
coverage/

# OS files
.DS_Store

# IDE
.vscode/
.idea/
EOF

```

Phase 2: Backend Implementation


Step 2.1: Setup Backend

```
# Navigate to api directory
cd api

# Initialize package.json
npm init -y

# Install dependencies
npm install express cors helmet dotenv express-rate-limit
npm install --save-dev jest supertest nodemon

```

Step 2.2: Create Backend Files

api/server.js file:

```
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sample data
let products = [
  { id: 1, name: 'MacBook Pro', price: 1299.99, category: 'Electronics', stock: 15 },
  { id: 2, name: 'iPhone 15', price: 799.99, category: 'Electronics', stock: 30 },
  { id: 3, name: 'Samsung Galaxy', price: 699.99, category: 'Electronics', stock: 25 },
  { id: 4, name: 'Nike Air Max', price: 120.99, category: 'Fashion', stock: 50 }
];

let orders = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running', 
    timestamp: new Date().toISOString() 
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  res.json({
    success: true,
    data: product
  });
});

// Create order
app.post('/api/orders', (req, res) => {
  const { productId, quantity, customerName, customerEmail } = req.body;
  
  if (!productId || !quantity || !customerName || !customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock'
    });
  }
  
  // Update stock
  product.stock -= quantity;
  
  // Create order
  const order = {
    id: orders.length + 1,
    productId: parseInt(productId),
    productName: product.name,
    quantity: parseInt(quantity),
    totalPrice: product.price * quantity,
    customerName,
    customerEmail,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  orders.push(order);
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// Get orders
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

const PORT = process.env.PORT || 3000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;

```

Create test file
app.test.js :

```

const request = require('supertest');
const app = require('./server');

describe('E-Commerce API', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return all products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(4);
  });

  it('should return single product', async () => {
    const response = await request(app).get('/api/products/1');
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(1);
  });

  it('should create order', async () => {
    const orderData = {
      productId: 2,
      quantity: 1,
      customerName: 'Test User',
      customerEmail: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/orders')
      .send(orderData);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});

```

Step 2.3: Test Backend

```

# Run tests
npm test

# Start development server (in a new terminal tab)
npm start

# Test API endpoints (in original terminal)
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products

```

Phase 3: Frontend Implementation

Step 3.1: Setup React App

```
# Navigate to webapp directory
cd ../webapp

# Create React app structure
npm init -y

# Install React and required dependencies
npm install react react-dom react-scripts typescript @types/react @types/react-dom axios
```

Step 3.2: Create Frontend Components

Create package.json

```

{
  "name": "ecommerce-frontend",
  "version": "1.0.0",
  "description": "E-Commerce Frontend Application",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.4.0",
    "typescript": "^4.9.5",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

```

Create Essential React Files

Create public/index.html:

```
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>E-Commerce Store</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

```

Create src/index.js:

```
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

```

src/App.js file:

```

cat > src/App.js << 'EOF'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    productId: '',
    quantity: '1',
    customerName: '',
    customerEmail: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/orders`, {
        productId: parseInt(orderForm.productId),
        quantity: parseInt(orderForm.quantity),
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail
      });

      if (response.data.success) {
        alert(`Order created! Order ID: ${response.data.data.id}`);
        setOrderForm({
          productId: '',
          quantity: '1',
          customerName: '',
          customerEmail: ''
        });
        fetchProducts(); // Refresh products
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Order failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="App">
      <header className="header">
        <h1>🛍️ E-Commerce Store</h1>
      </header>

      <main>
        <div className="order-section">
          <h2>Place Order</h2>
          <form onSubmit={handleOrderSubmit} className="order-form">
            <div className="form-group">
              <label>Product:</label>
              <select 
                value={orderForm.productId} 
                onChange={(e) => setOrderForm({...orderForm, productId: e.target.value})}
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                value={orderForm.customerName}
                onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Your Email:</label>
              <input
                type="email"
                value={orderForm.customerEmail}
                onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Place Order
            </button>
          </form>
        </div>

        <div className="products-section">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <p className="stock">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
EOF


```

create src/App.css file


```
cat > src/App.css << 'EOF'
.App {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  background: #282c34;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.order-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.order-form {
  display: grid;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.price {
  font-size: 1.5em;
  font-weight: bold;
  color: #2c5aa0;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
}
EOF


```

Step 3.3: Test Frontend

```

# Install all dependencies
npm install

# Start the development server
npm start

Visit http://localhost:3001 to see your frontend working.

```

Phase 4: Docker Setup

Step 4.1: Create Dockerfiles

```
# Navigate back to project root
cd ..

# Create backend Dockerfile
cat > api/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
EOF

# Create frontend Dockerfile
cat > webapp/Dockerfile << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

```

Step 4.2: Test Docker Builds

```
# Build backend image
cd api
docker build -t ecommerce-api .

# Build frontend image
cd ../webapp
docker build -t ecommerce-frontend .

# Test running containers
docker run -p 3000:3000 ecommerce-api &
docker run -p 80:80 ecommerce-frontend &

```

Phase 5: GitHub Actions Setup

Step 5.1: Create CI Workflow


```
# Navigate to project root
cd ..

# Create CI workflow
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: api/package-lock.json
      
      - name: Install dependencies
        run: npm install
        working-directory: api
      
      - name: Run tests
        run: npm test
        working-directory: api

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: webapp/package-lock.json
      
      - name: Install dependencies
        run: npm install
        working-directory: webapp
      
      - name: Run tests
        run: npm test -- --watchAll=false
        working-directory: webapp
      
      - name: Build
        run: npm run build
        working-directory: webapp
EOF
```

Phase 6: AWS Deployment Setup

Step 6.1: Create AWS Deployment Workflow

```

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to AWS

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_BACKEND: ecommerce-backend
  ECR_FRONTEND: ecommerce-frontend
  CLUSTER: ecommerce-cluster
  SERVICE: ecommerce-backend-service

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Configure AWS
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Login to ECR
      id: ecr
      uses: aws-actions/amazon-ecr-login@v2

    - name: Build and Push Backend
      run: |
        cd api
        docker build -t ${{ steps.ecr.outputs.registry }}/$ECR_BACKEND:latest .
        docker push ${{ steps.ecr.outputs.registry }}/$ECR_BACKEND:latest
        echo "✅ Backend image pushed to ECR"

    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster $CLUSTER \
          --service $SERVICE \
          --force-new-deployment \
          --region $AWS_REGION
        echo "🚀 Backend deployed to ECS"

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    environment: production
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Configure AWS
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Build Frontend
      run: |
        cd webapp
        npm install
        npm run build
        echo "✅ Frontend built"

    - name: Deploy to S3
      run: |
        aws s3 sync ./webapp/build/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
        echo "🌐 Frontend deployed to S3"

    - name: Invalidate CloudFront
      run: |
        aws cloudfront create-invalidation \
          --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
          --paths "/*" || echo "CloudFront optional"
        echo "🔄 CloudFront cache invalidated"
EOF

```

Step 6.2: Create AWS Setup Scripts


```
# Create AWS scripts directory
mkdir -p aws/scripts

# Create setup script
cat > aws/scripts/setup-aws.sh << 'EOF'
#!/bin/bash

echo "🚀 Setting up AWS infrastructure for E-Commerce Platform..."

# Create ECR repositories
aws ecr create-repository --repository-name ecommerce-backend --region us-east-1 || echo "Backend ECR exists"
aws ecr create-repository --repository-name ecommerce-frontend --region us-east-1 || echo "Frontend ECR exists"

# Create S3 bucket for frontend
BUCKET_NAME="ecommerce-frontend-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME --region us-east-1
echo "Frontend S3 bucket: $BUCKET_NAME"

# Configure bucket for static website
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

echo "✅ AWS infrastructure ready!"
echo "📝 Update GitHub Secrets with:"
echo "S3_BUCKET_NAME: $BUCKET_NAME"
EOF

# Create cleanup script
cat > aws/scripts/cleanup-aws.sh << 'EOF'
#!/bin/bash

echo "🧹 Cleaning up AWS resources..."

# Stop ECS service
aws ecs update-service --cluster ecommerce-cluster --service ecommerce-backend-service --desired-count 0 --region us-east-1 2>/dev/null && echo "Stopped ECS service"

# Delete ECR images
for repo in ecommerce-backend ecommerce-frontend; do
    aws ecr batch-delete-image --repository-name $repo --image-ids "$(aws ecr list-images --repository-name $repo --region us-east-1 --query 'imageIds[*]' --output json)" --region us-east-1 2>/dev/null && echo "Cleared ECR: $repo"
done

echo "✅ AWS cleanup completed"
EOF

# Make scripts executable
chmod +x aws/scripts/*.sh

```

Phase 7: Final Commit & GitHub Setup

Step 7.1: Commit Everything

```
# Add all files to git
git add .

# Initial commit
git commit -m "feat: Complete e-commerce platform with AWS deployment

- Backend API with Express.js and testing
- Frontend React application with product catalog
- Docker containerization for both services
- GitHub Actions CI/CD pipeline
- AWS deployment configuration
- ECS Fargate deployment for backend
- S3 + CloudFront deployment for frontend
- AWS cleanup scripts for cost control"

# Create GitHub repository (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-platform.git
git branch -M main
git push -u origin main

```

Step 7.2: Configure GitHub Secrets
After pushing to GitHub:

1. Go to your repository on GitHub

2. Click Settings → Secrets and variables → Actions

3. Add these secrets:

- AWS_ACCESS_KEY_ID

- AWS_SECRET_ACCESS_KEY

- AWS_ACCOUNT_ID

- AWS_REGION (us-east-1)

- S3_BUCKET_NAME (run setup script to get this)


Phase 8: Testing Everything

```
# Test backend
cd api
npm test
npm start

# Test frontend (new terminal)
cd ../webapp
npm start

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products

```

Step 8.2: Verify GitHub Actions

1. Go to your GitHub repository

2. Click Actions tab

3. You should see workflows running

4. Ensure both CI and Deploy workflows complete successfully

Next Steps:

1. Set up AWS infrastructure:

```bash
./aws/scripts/setup-aws.sh

```

2. Deploy to AWS:

- Push to main branch or manually trigger deployment

3. Monitor deployment:

- Check GitHub Actions logs

3. Verify resources in AWS Console

4. Test production:

- Access your live application

- Test all features



<img width="2446" height="1242" alt="image" src="https://github.com/user-attachments/assets/283eb7e6-a809-4dd1-bccc-2630013db8ab" />

<img width="1790" height="1272" alt="image" src="https://github.com/user-attachments/assets/394ce087-dd52-4f5e-ab4b-425697922b8c" />

<img width="1826" height="858" alt="image" src="https://github.com/user-attachments/assets/15b2d27f-1761-4bc2-928e-0a9b2fd32c1e" />



