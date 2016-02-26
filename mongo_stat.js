var counter = 0, users = {}, do_not_search =[], criteria = {
    byPartner:"Terra",
    offerDateSent:{
        $gte:ISODate("2016-01-01 00:00:00.000Z"),
        $lt:ISODate("2016-02-01 00:00:00.000Z")
    },
    status:true
};
(function(){
    Object.prototype.CheckProperties = Array.prototype.CheckProperties = function ( ns , returnValue, callback )
    {
        var pieces = (typeof ns == "string") ?  ns.split( "." ) : [ ns ];

        /**
         * Проходим рекурсивно по объекту
         * @param aProps
         * @param object
         * @param returnValue
         * @returns {boolean}
         */
        function checkProp ( aProps, object , returnValue )
        {
            var prop = aProps.shift();
            var hasProp = object.hasOwnProperty( prop );

            if ( aProps.length && hasProp )
            {
                return checkProp( aProps, object[prop] , returnValue )
            } else
            {
                return hasProp ?
                    (
                        returnValue ?
                            (
                                typeof object[prop]!="undefined" ?
                                    (
                                        callback ? callback( object[prop] ) : object[prop]
                                    )

                                    : null
                            )
                            : hasProp
                    )
                    : hasProp;
            }
        }

        return checkProp( pieces, this , returnValue );
    };

    Object.prototype.SetProperties = function(ns, value)
    {
        var pieces = (typeof ns == "string") ?  ns.split( "." ) : ns,
            prop = pieces.shift();

        if(pieces.length){

            if(!this.hasOwnProperty(prop))
                this[prop] = new Object();
            this[prop].SetProperties(pieces, value)

        } else {
            this[prop] = value;
        }

    };
})();

var res = db.postbacks.find(criteria).sort({offerDateSent:1});

function getAdditional(userId){

    if(do_not_search.indexOf(userId) == -1) {

        var ip = users.CheckProperties(userId + ".ip"),

            req = db.requests.find({
                "userId": userId
            }).sort({offerDate: 1});

        req.forEach(function (item) {
            users.SetProperties([item.userId, "registration"], item.registerTime);
            users.SetProperties([item.userId, "last_offer", "name"], item.offer);
            users.SetProperties([item.userId, "last_offer", "date"], item.offerDate);

            if (!ip) {
                for (tag in item.tags) {
                    var stag = item.CheckProperties("tags." + tag, true).toString();
                    if (stag.substr(0, 3) == "ip_")

                        users.SetProperties([item.userId, "ip"], stag.substr(3));

                }
            }
        });
        do_not_search.push(userId);
    }
}

res.forEach(function(item){
    ++counter;
    users.SetProperties([item.userId,"email"]                       , item.email);
    users.SetProperties([item.userId,"referal"]                     , item.refName);
    users.SetProperties([item.userId,"offers",item.offer,"url"]     , item.url);
    users.SetProperties([item.userId,"offers",item.offer,"date"]    , item.offerDateSent);
    users.SetProperties([item.userId,"offers",item.offer,"status"]  , item.status);
    getAdditional(item.userId);
});

print(users);
print(counter);
