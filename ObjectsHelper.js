    var Helper = {

        theprop : {
            subprop : {
                subsubprop : 'string'
            }
        },

        Test : function ()
        {
            return {
                exist    : Helper.CheckProperties( 'theprop.subprop.subsubprop', Helper ),
                valueval : Helper.CheckProperties( 'theprop.subprop.subsubprop', Helper , true ),
                notexist : Helper.CheckProperties( 'theprop.subprop.subsubprop2', Helper ),
                value    : Helper.CheckProperties( 'theprop.subprop.subsubprop.string', Helper ),
                valuelen : Helper.CheckProperties( 'theprop.subprop.subsubprop.string.length', Helper ),
                valuefun : Helper.CheckProperties( 'Test', Helper )
            }
        },

        /**
         *
         * @param {string}  ns Цепочка свойств в формате неймспейса
         * например: 'property.subProperty.subSubProperty'
         *
         * @param {object}  obj Проверяемый объект
         * @param {boolean} returnValue Если true - вернуть значение свойства
         *
         * @returns {boolean|value}
         * @constructor
         */
        CheckProperties : function ( ns, obj , returnValue )
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
    
                if ( aProps.length && hasProp )
                {
                    return checkProp( aProps, object[prop] , returnValue )
                } else
                {
                    return hasProp ?
                        (
                            returnValue ?
                                (
                                    typeof object[prop]!=='undefined' ? object[prop]
    
                                        : null
                                )
                                : hasProp
                        )
                        : hasProp;
                }
            }
    
            return checkProp( pieces, obj , returnValue );
        }

    };

    Helper.Test();
