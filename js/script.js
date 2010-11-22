/* Author: C. Scott Ananian
 */

function page_init($) {
    // SCALE FACTOR for box2d
    var SCALE = 1/100.;

    // the #main box is the 'walls' of the physics area
    var main = $('#main');
    var mainHeight = main.innerHeight();
    var mainWidth = main.innerWidth();

    // we're going to animate the content box
    var content = $('#content');
    var contentHeight = content.innerHeight();
    var contentWidth = content.innerWidth();
    var contentPos = content.position();

    // ---------------------------------------------------------

    // Box2D namespace
    var   b2Vec2 = Box2D.Common.Math.b2Vec2,
          b2AABB = Box2D.Collision.b2AABB,
          b2BodyDef = Box2D.Dynamics.b2BodyDef,
          b2Body = Box2D.Dynamics.b2Body,
          b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
          b2Fixture = Box2D.Dynamics.b2Fixture,
          b2World = Box2D.Dynamics.b2World,
          b2MassData = Box2D.Collision.Shapes.b2MassData,
          b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
          b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
          b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
          b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

    var world = new b2World(new b2Vec2(0, 10),    //gravity
                            true);                //allow sleep

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.5;

    var bodyDef = new b2BodyDef;

    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(SCALE*mainWidth/2, 1);
    bodyDef.position.Set(SCALE*mainWidth/2, -1);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(SCALE*mainWidth/2, SCALE*mainHeight + 1);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(1, SCALE*mainHeight/2);
    bodyDef.position.Set(-1, SCALE*mainHeight/2);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(SCALE*mainWidth + 1, SCALE*mainHeight/2);
    world.CreateBody(bodyDef).CreateFixture(fixDef);


    //create some objects
    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.restitution = 0.6;
    fixDef.shape.SetAsBox(SCALE*contentWidth/2 /* half width */,
                          SCALE*contentHeight/2 /* half height */);
    bodyDef.position.x = SCALE * (contentPos.left + (contentWidth/2));
    bodyDef.position.y = SCALE * (contentPos.top + (contentHeight/2));
    bodyDef.angle = 1*3.141592654/180;

    var balloonInitialPos = bodyDef.position.Copy();
    var balloon = world.CreateBody(bodyDef);
    balloon.CreateFixture(fixDef);

    // allow dragging the bubbles
    var mouseVec = new b2Vec2(0,0), lastMouseVec = new b2Vec2(0,0);
    var mouseIn = false, mouseMoved = false, mouseJoint = null;
    main.mouseenter(function(e) { mouseIn = true; });
    main.mouseleave(function(e) { mouseIn = false; });
    main.mousemove(function(e) {
        var mainOffset = main.offset();
        if (!mouseMoved) {
            mouseMoved = true;
            lastMouseVec = mouseVec.Copy();
        }
        mouseVec.Set((e.pageX - mainOffset.left)*SCALE,
                     (e.pageY - mainOffset.top)*SCALE);
    });
    function getBodyAtMouse() {
        var aabb = new b2AABB();
        aabb.lowerBound.Set(mouseVec.x - 0.001, mouseVec.y - 0.001);
        aabb.upperBound.Set(mouseVec.x + 0.001, mouseVec.y + 0.001);

        // Query the world for overlapping shapes.
        var selectedBody = null;
        function getBodyCB(fixture) {
            if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
                if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mouseVec)) {
                    selectedBody = fixture.GetBody();
                    return false;
                }
            }
            return true;
        }
        world.QueryAABB(getBodyCB, aabb);
        return selectedBody;
    }

    function rot(x) {
        var deg = x*180/3.141592654;
        var r = 'rotate('+deg+'deg)';
        return { transform: r,
                '-moz-transform': r,
                '-webkit-transform': r,
                '-o-transform': r };
    }
    function update() {
        if (mouseJoint && !(mouseMoved && mouseIn)) {
            world.DestroyJoint(mouseJoint);
            mouseJoint = null;
        }
        if (mouseIn && (!mouseJoint)) {
            var body = getBodyAtMouse();
            if(body) {
                var md = new b2MouseJointDef();
                md.bodyA = world.GetGroundBody();
                md.bodyB = body;
                md.target.Set(mouseVec.x, mouseVec.y);
                md.collideConnected = true;
                md.maxForce = 10.0 * body.GetMass();
                mouseJoint = world.CreateJoint(md);
                body.SetAwake(true);
            }
        }
        if (mouseJoint) {
            mouseJoint.SetTarget(new b2Vec2(mouseVec.x, mouseVec.y));
        }
        world.Step(1 / 30, 10, 10);
        world.ClearForces();
        // update balloon position
        var p = balloon.GetPosition().Copy();
        p.Subtract(balloonInitialPos);
        content.css({ left: (p.x/SCALE)+'px', top: (p.y/SCALE)+'px' });
        content.css(rot(balloon.GetAngle()));
        // update buoyancy
        var force = new b2Vec2();
        force.Set(0, -11 * balloon.GetMass());
        balloon.ApplyForce(force, balloon.GetPosition());
    };
    window.setInterval(update, 1000 / 30 /* 30 fps (in ms) */);

};

// remap jQuery to $
(function($){
    $(document).ready(function(){ page_init($); });
})(this.jQuery);
