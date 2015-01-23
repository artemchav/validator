class Helper
    theprop : {
        subprop: {
            subsubprop: 'string'
        }
    }
    Test           : () ->
        return {
            exist   : @CheckProperties('theprop.subprop.subsubprop', @),
            value   : @CheckProperties('theprop.subprop.subsubprop', @, true),
            notexist: @CheckProperties('theprop.subprop.subsubprop2',@),
        }
    CheckProperties: (ns, obj, returnValue) ->
        pieces = ns.split('.')

        checkProp = (aProps, object, returnValue) ->
            prop = aProps.shift()
            hasProp = object.hasOwnProperty prop

            if aProps.length and hasProp
                return checkProp aProps, object[prop], returnValue

            else
                if hasProp
                    if returnValue
                        if object[prop]
                            return object[prop]
                        else return null
                    else hasProp
                else hasProp


        return checkProp pieces, obj, returnValue

console.log Helper::Test()
