pipeline {
 
    agent {
        label 'docker'
    }
 
    stages {
 
        stage('Checkout') {
            steps {
                echo '===== Checking Out Code from GitHub ====='
                checkout scm
            }
        }
 
        stage('Verify Files') {
            steps {
                sh '''
                    echo "===== Files from GitHub ====="
                    pwd
                    ls -la
                '''
            }
        }
 
        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "===== Building Docker Image ====="
 
                    docker build -t devops-quest:${BUILD_NUMBER} .
 
                    echo "===== Docker Image Built ====="
                    docker images | grep devops-quest
                '''
            }
        }
 
        stage('Push Docker Image to Docker Hub') {
            steps {
 
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
 
                    sh '''
                        echo "===== Login to Docker Hub ====="
 
                        echo "$DOCKER_TOKEN" | docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin
 
                        echo "===== Tagging Docker Image ====="
 
                        docker tag \
                            devops-quest:${BUILD_NUMBER} \
                            $DOCKER_USER/devops-quest:${BUILD_NUMBER}
 
                        echo "===== Pushing Docker Image ====="
 
                        docker push \
                            $DOCKER_USER/devops-quest:${BUILD_NUMBER}
 
                        echo "===== Docker Push Completed ====="
                    '''
                }
            }
        }
 
        stage('Deploy Application') {
            steps {
                sh '''
                    echo "===== Deploying Application ====="
        
                    echo "Stopping existing container if present..."
                    docker stop devops-quest-app || true
        
                    echo "Removing existing container if present..."
                    docker rm devops-quest-app || true
        
                    echo "Removing any failed devops-quest container..."
                    docker rm -f devops-quest || true
        
                    echo "Starting Build ${BUILD_NUMBER}..."
        
                    docker run -d \
                        --name devops-quest-app \
                        -p 80:80 \
                        vickyamav/devops-quest:${BUILD_NUMBER}
        
                    echo "===== Running Container ====="
                    docker ps
                '''
            }
        }
 
    }
 
    post {
 
        success {
            echo '=========================================='
            echo 'Pipeline execution completed successfully!'
            echo 'Docker image built and pushed to Docker Hub!'
            echo 'Latest application deployed successfully!'
            echo '=========================================='
        }
 
        failure {
            echo '=========================================='
            echo 'Pipeline failed. Check the stage logs.'
            echo '=========================================='
        }
 
        always {
            sh 'docker logout || true'
        }
    }
}