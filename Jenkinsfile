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
                    docker images | grep devops-quest
                '''
            }
        }
    }
 
    post {
        success {
            echo 'Docker image built successfully on Jenkins Agent!'
        }
 
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}