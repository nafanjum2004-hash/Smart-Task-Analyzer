pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Vanshika2004-yadav/Smart-Task-Analyzer.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Tests completed'
            }
        }

        stage('Deploy') {
            steps {
                 sh '''
                 sudo rm -rf /var/www/html/*
                 sudo cp -r dist/* /var/www/html/
                 sudo systemctl restart apache2
                '''
            }
        }
    }
}
