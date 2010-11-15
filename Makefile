# upload rules
upload:
	-$(RM) -rf clean
	git archive --format=tar --prefix=clean/ HEAD | tar -x
	rsync -avz --exclude=build/ clean/ cscott.net:web/asterism.us/wedding/
	-$(RM) -rf clean
