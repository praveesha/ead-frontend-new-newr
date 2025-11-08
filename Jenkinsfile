pipeline {
  agent any
  environment {
    S3_BUCKET = 'your-frontend-bucket-name'
    CLOUDFRONT_DISTRIBUTION_ID = 'YOUR_DISTRIBUTION_ID'
    BUILD_DIR = 'dist'
    AWS_REGION = 'us-east-1'

    AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
    AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install deps') {
      steps {
        sh 'node -v || true'
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        // Build explicitly with Vite and TypeScript in CI for clarity and reproducibility
        // `npm ci` installs dependencies from package-lock.json; use npx to run local binaries
        sh 'npx tsc -b && npx vite build'
        sh "ls -la ${BUILD_DIR} || true"
      }
    }

    stage('Upload to S3') {
      steps {
        // This assumes `aws` CLI is available on the Jenkins agent. If not, run this stage in a docker image that has awscli.
        sh '''
          set -e
          echo "Uploading build to S3 bucket: ${S3_BUCKET}"
          aws --version || (echo "aws cli missing on agent" && exit 2)
          # Sync the build to S3; use --delete to remove old files
          aws s3 sync ${BUILD_DIR}/ s3://${S3_BUCKET}/ --acl private --delete --region ${AWS_REGION} --cache-control "max-age=31536000,public"
          # Replace index.html to have short cache so SPA shell updates quickly
          aws s3 cp ${BUILD_DIR}/index.html s3://${S3_BUCKET}/index.html --region ${AWS_REGION} --metadata-directive REPLACE --cache-control "max-age=0,public"
        '''
      }
    }

    stage('Invalidate CloudFront') {
      steps {
        sh '''
          set -e
          echo "Creating CloudFront invalidation for distribution ${CLOUDFRONT_DISTRIBUTION_ID}"
          aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*" || true
        '''
      }
    }
  }

  post {
    success {
      echo "Frontend deployed to s3://${S3_BUCKET} and invalidation triggered (if configured)."
    }
    failure {
      echo "Deployment failed — check the logs above."
    }
  }
}
