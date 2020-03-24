#!/bin/bash
dirname=$(ls -dt ./backup/20* | head -1) && scp -rp $dirname/uploads/ dci@46.101.220.207:/home/dci/digitalcareerinstitute.org/
#restore staging env
#dirname=$(ls -dt ./backup/20* | head -1) && scp -rp $dirname/uploads/ dci@46.101.220.207:/home/dci/staging.digitalcareerinstitute.org/
