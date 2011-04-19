all: upload

# upload rules
upload:
	cd build && ant
	rsync -avz publish/ cscott.net:web/asterism.us/wedding/

stage:
	cd build && ant
	rsync -avz publish/ cscott.net:web/asterism.us/wedding.staged/

# quicker target (without optimization) for development
stage.git:
	-$(RM) -rf clean
	git archive --format=tar --prefix=clean/ HEAD | tar -x
	rsync -avz --exclude=build/ clean/ cscott.net:web/asterism.us/wedding.staged/
	-$(RM) -rf clean
