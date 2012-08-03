KISSY.add("areaselect", function (S) {
    function AreaSelect() {
        this._init.apply(this, arguments);
    }
    AreaSelect.prototype = {
        _init: function (conSel,cfg) {
            var self = this,
            config={
            	prov:"110000",
            	city:"110100",
            	area:"110101"
            }
            nContent = S.one(conSel),
            nProv = nContent.one(".J_Prov"),
            nCity = nContent.one(".J_City"),
            nArea = nContent.one(".J_Area");
            S.mix(config,cfg)
            self.set("nContent" , nContent);
            self.set("nProv",nProv);
            self.set("nCity",nCity);
            self.set("nArea",nArea);
            self.bindProv(config["prov"]);
            self.bindCity(config["prov"],config["city"]);
            self.bindArea(config["prov"],config["city"],config["area"]);
            self._bind();
        },
        _bind: function () {
            var self = this,
            nArea = self.get("nArea"),
            nProv = self.get("nProv"),
            nCity = self.get("nCity");
            nCity && nCity.on("change", function (e) {
                var nTar = S.one(e.currentTarget),
                city = nTar.val(),
                prov = self.get("prov");
                self.bindArea(prov, city);
            });
            nArea && nArea.on("change", function (e) {
                var nTar = S.one(e.currentTarget),
                area = nTar.val();
                self.set("area" ,area);
            });
            nProv && nProv.on("change", function (e) {
                var nTar = S.one(e.currentTarget),
                prov = nTar.val();
                self.bindCity(prov);
            });
        },
        set:function(key,val){
        	var self=this;
        	self[key]=val;
        	return this;
        },
        get:function(key){
        	var self=this;
        	if(S.isUndefined(self[key])){
        		return false;
        	}else{
        		return self[key];
        	}
        },
        bindProv: function (nprov) {
            var self = this,
            nContent=self.get("nContent"),
            nArea = self.get("nArea"),
            nProv = self.get("nProv"),
            nCity = self.get("nCity"),
            sProv = "",
            prov = nprov ; //default:beijing
            if (nProv.children().length===0) {
                S.each(AREACODE.prov, function (v, k, o) {
                    sProv += '<option value="' + v + '">' + AREACODE[v][0] + '</option>';
                });
                nProv.html("").append(sProv).val(prov);
            }
            self.set("prov" ,prov);
            self.bindCity(prov);
        },
        bindCity: function (prov,city) {
            var self = this,
            nArea = self.get("nArea"),
            nProv = self.get("nProv"),
            nCity = self.get("nCity"),
            sCity = "",
            count = 0,
            firstCity = "",
            currentCity="";
            self.set("prov",prov);
            S.each(AREACODE["1"][prov], function (v, k, o) {
                var ccity = k,
                name = AREACODE[ccity][0];
                sCity += '<option value="' + ccity + '">' + name + '</option>';
                count++;
                if (count == 1) {
                    firstCity = ccity;
                }
            });
            currentCity=S.isUndefined(city)?firstCity:city;
            nCity.html("").append(sCity).val(currentCity);
            self.bindArea(prov, currentCity);
        },
        bindArea: function (prov,city,area) {
            var self = this,
            nArea = self.get("nArea"),
            nProv = self.get("nProv"),
            nCity = self.get("nCity"),
            sArea = "",
            firstArea="",
            currentArea="",
            count = 0;
            self.set("city" ,city);
            S.each(AREACODE["1"][prov][city], function (v, k, o) {
                var carea = v,
                name = AREACODE[carea][0];
                sArea += '<option value="' + carea + '">' + name + '</option>';
                count++;
                if (count == 1) {
                    firstArea = carea;
                }
            });
            currentArea=S.isUndefined(area)?firstArea:area;
            nArea.html("").append(sArea).val(currentArea);
            self.set("area" ,currentArea);
        },
        getAddress: function () {
            var self = this,
            area = self.get("area"),
            prov = self.get("prov"),
            city = self.get("city"),
            sArea = AREACODE[area][0],
            sCity = AREACODE[city][0],
            sProv = AREACODE[prov][0],
            address = sProv + sCity + sArea,
            o = {
                prov: prov,
                city: city,
                area: area,
                sProv: sProv,
                sCity: sCity,
                sArea: sArea,
                address: address
            };
            self.set("address");
            return o;
        }
    };
    S.AreaSelect = AreaSelect;
    return AreaSelect;
},
{
    attach: false,
    requires: ['sizzle']
});