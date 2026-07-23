pipeline {
 
    agent {
        label 'docker'
    }
 
    stages {
 
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
 
        stage('Verify Files') {
            steps {
                sh '''
                    echo "===== Files from Github ====="
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
 
                        echo "===== Tagging Image ====="
 
                        docker tag devops-quest:${BUILD_NUMBER} \
                        $DOCKER_USER/devops-quest:${BUILD_NUMBER}
 
                        echo "===== Pushing Image ====="
 
                        docker push \
                        $DOCKER_USER/devops-quest:${BUILD_NUMBER}
                    '''
                }
            }
        }
 
        stage('Deploy Application') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
 
                    sh '''
                        echo "===== Deploying Application ====="
 
                        echo "Stopping existing container if present..."
                        docker stop devops-quest-app || true
 
                        echo "Removing existing container if present..."
                        docker rm devops-quest-app || true
 
                        echo "Pulling new image..."
                        docker pull $DOCKER_USER/devops-quest:${BUILD_NUMBER}
 
                        echo "Starting new container..."
                        docker run -d \
                        --name devops-quest-app \
                        -p 80:80 \
                        $DOCKER_USER/devops-quest:${BUILD_NUMBER}
 
                        echo "===== Running Container ====="
                        docker ps
                    '''
                }
            }
        }
    }
 
    post {
 
        success {
            echo 'Build, Push and Deployment completed successfully!'
        }
 
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
 
        always {
            echo 'Pipeline execution completed.'
        }
    }
}