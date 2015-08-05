define ['jquery', 'angular'], ($, angular) ->

    app = angular.module 'myblog'

    filterType = (data,param) ->
        if param then type = param
        if type and data and type isnt 'all'
            output = []
            for i in data
                if i.type is type
                    output.push i
            ##console.log output
            return output
        return data 
    app.filter 'blogListType', ->
        blogListType = filterType

