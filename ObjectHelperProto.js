Object.prototype.CheckProperties = Array.prototype.CheckProperties = function ( ns , returnValue, callback )
{
    var pieces = (typeof ns == 'string') ?  ns.split( '.' ) : [ ns ];

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
        console.log(prop);
        if ( aProps.length && hasProp )
        {
            return checkProp( aProps, object[prop] , returnValue )
        } else
        {
            return hasProp ?
                (
                    returnValue ?
                        (
                            typeof object[prop]!='undefined' ?
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
    var pieces = (typeof ns == 'string') ?  ns.split( '.' ) : ns,
        prop = pieces.shift();

        if(pieces.length){

            if(!this.hasOwnProperty(prop))
                this[prop] = new Object();

            this[prop].SetProperties(pieces, value)

        } else {
            this[prop] = value;
        }

};
var users = {};
users.SetProperties('a.bbbb.vvvv.dddddd', 1000);
users.CheckProperties('a.bbbb.vvvv.dddddd', 1);
console.log(users.CheckProperties('a.bbbb.vvvv.dddddd', 1));
