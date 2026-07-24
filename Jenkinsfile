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
 
        // =====================================================
        // BUILD FRONTEND
        // =====================================================
 
        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                    echo "===== Building Frontend Docker Image ====="
 
                    docker build \
                        -t devops-quest:${BUILD_NUMBER} .
 
                    echo "===== Frontend Docker Image Built ====="
 
                    docker images | grep devops-quest
                '''
            }
        }
 
        // =====================================================
        // BUILD BACKEND
        // =====================================================
 
        stage('Build Backend Docker Image') {
            steps {
                sh '''
                    echo "===== Building Backend Docker Image ====="
 
                    docker build \
                        -f Dockerfile.backend \
                        -t devops-quest-backend:${BUILD_NUMBER} .
 
                    echo "===== Backend Docker Image Built ====="
 
                    docker images | grep devops-quest-backend
                '''
            }
        }
 
        // =====================================================
        // PUSH FRONTEND + BACKEND TO DOCKER HUB
        // =====================================================
 
        stage('Push Docker Images to Docker Hub') {
 
            steps {
 
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
 
                    sh '''
                        echo "===== Login to Docker Hub ====="
 
                        echo "$DOCKER_TOKEN" | docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin
 
 
                        echo "===== Tagging Frontend Image ====="
 
                        docker tag \
                            devops-quest:${BUILD_NUMBER} \
                            $DOCKER_USER/devops-quest:${BUILD_NUMBER}
 
 
                        echo "===== Pushing Frontend Image ====="
 
                        docker push \
                            $DOCKER_USER/devops-quest:${BUILD_NUMBER}
 
 
                        echo "===== Tagging Backend Image ====="
 
                        docker tag \
                            devops-quest-backend:${BUILD_NUMBER} \
                            $DOCKER_USER/devops-quest-backend:${BUILD_NUMBER}
 
 
                        echo "===== Pushing Backend Image ====="
 
                        docker push \
                            $DOCKER_USER/devops-quest-backend:${BUILD_NUMBER}
 
 
                        echo "===== Docker Push Completed ====="
                    '''
                }
            }
        }
 
        // =====================================================
        // DEPLOY FRONTEND
        // =====================================================
 
        stage('Deploy Frontend') {
 
            steps {
 
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
 
                    sh '''
                        echo "===== Deploying Frontend ====="
 
                        echo "Stopping existing frontend container..."
                        docker stop devops-quest-app || true
 
                        echo "Removing existing frontend container..."
                        docker rm devops-quest-app || true
 
                        echo "Removing old failed container..."
                        docker rm -f devops-quest || true
 
 
                        echo "Starting Frontend Build ${BUILD_NUMBER}..."
 
                        docker run -d \
                            --name devops-quest-app \
                            -p 80:80 \
                            $DOCKER_USER/devops-quest:${BUILD_NUMBER}
 
 
                        echo "===== Frontend Container Started ====="
 
                        docker ps
                    '''
                }
            }
        }
 
        // =====================================================
        // DEPLOY BACKEND
        // =====================================================
 
        stage('Deploy Backend') {
 
            steps {
 
                withCredentials([
 
                    usernamePassword(
                        credentialsId: 'jenkins-api-credentials',
                        usernameVariable: 'JENKINS_USER',
                        passwordVariable: 'JENKINS_API_TOKEN'
                    ),
 
                    string(
                        credentialsId: 'jenkins-trigger-token',
                        variable: 'JENKINS_TRIGGER_TOKEN'
                    ),
 
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
 
                ]) {
 
                    sh '''
                        echo "===== Deploying Backend ====="
 
                        echo "Stopping existing backend container..."
                        docker stop devops-quest-backend || true
 
                        echo "Removing existing backend container..."
                        docker rm devops-quest-backend || true
 
 
                        echo "Starting Backend Build ${BUILD_NUMBER}..."
 
                        docker run -d \
                            --name devops-quest-backend \
                            -p 5000:5000 \
                            -e JENKINS_USER="$JENKINS_USER" \
                            -e JENKINS_API_TOKEN="$JENKINS_API_TOKEN" \
                            -e JENKINS_TRIGGER_TOKEN="$JENKINS_TRIGGER_TOKEN" \
                            $DOCKER_USER/devops-quest-backend:${BUILD_NUMBER}
 
 
                        echo "===== Backend Container Started ====="
 
                        docker ps
                    '''
                }
            }
        }
    }
 
 
    //
=========================================================
    // POST ACTIONS
    // =========================================================
 
    post {
 
        success {
 
            echo '=============================================='
            echo 'Pipeline execution completed successfully!'
            echo 'Frontend Docker image built and pushed!'
            echo 'Backend Docker image built and pushed!'
            echo 'Frontend application deployed successfully!'
            echo 'Backend application deployed successfully!'
            echo '=============================================='
        }
 
        failure {
 
            echo '=============================================='
            echo 'Pipeline failed. Check the stage logs.'
            echo '=============================================='
        }
 
        always {
 
            sh 'docker logout || true'
        }
    }
}