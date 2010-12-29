all: fonts/Harngton.eot upload

# upload rules
upload:
	cd build && ant
	rsync -avz publish/ cscott.net:web/asterism.us/wedding/

stage:
	cd build && ant
	rsync -avz publish/ cscott.net:web/asterism.us/wedding.staged/

upload.git:
	-$(RM) -rf clean
	git archive --format=tar --prefix=clean/ HEAD | tar -x
	rsync -avz --exclude=build/ clean/ cscott.net:web/asterism.us/wedding/
	-$(RM) -rf clean

fonts/Harngton.eot: fonts/Harngton.ttf
	mkeot $< http://asterism.us/ http://cscott.net/ \
	  http://xn--sei.us/ http://xn--kwg.us/ > $@
