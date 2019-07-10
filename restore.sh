cd ./backup
dirname=$(ls -dt ./* | head -1)
scp -rp /Users/thomaskuhnert/develop/dci/marketing-website/backup/$dirname/uploads/* dci@46.101.220.207:/home/dci/marketing-website/uploads
