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
 
                    echo "===== Docker Image Created ====="
                    docker images | grep devops-quest
                '''
            }
        }
 
        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
                    sh '''
                        echo "$DOCKER_TOKEN" | docker login \
                        -u "$DOCKER_USER" \
                        --password-stdin
                    '''
                }
            }
        }
 
        stage('Tag and Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
                    sh '''
                        echo "===== Tagging Docker Image ====="
 
                        docker tag devops-quest:${BUILD_NUMBER} \
                        ${DOCKER_USER}/devops-quest:${BUILD_NUMBER}
 
                        echo "===== Pushing to Docker Hub ====="
 
                        docker push \
                        ${DOCKER_USER}/devops-quest:${BUILD_NUMBER}
 
                        echo "===== Docker Push Completed ====="
                    '''
                }
            }
        }
    }
 
    post {
 
        success {
            echo 'Docker image built and pushed to Docker Hub successfully!'
        }
 
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
 
        always {
            echo "Pipeline execution completed."
        }
    }
}