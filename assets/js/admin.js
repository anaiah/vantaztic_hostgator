/*
author : Carlo O. Dominguez
getAll()
util.speak()
*/
let admin = {
	socket: null,
	//myIp: "http://192.168.62.221:10000", //https://vantaztic-api-onrender.onrender.com}
    //myIp: `https://vantaztic-api-onrender.onrender.com`,
    myIp: myIp,
    offset: 0,
    shopCart: [],
    dataforTag:null,
	//main func
    getAll: async (xtype,xstatus)=>{
        await fetch(`${admin.myIp}/getall/${xtype}/${xstatus}`,{
            cache:'reload'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            //=== reset nav tabs
            document.getElementById('nav-tab').innerHTML = ""
            document.getElementById('nav-po').innerHTML = ""
            document.getElementById('nav-po').innerHTML = "NO DATA TO SHOW!"
            document.getElementById('nav-client').innerHTML = ""
            let xdata, xstat, xprice, imgId = 0, cartid = 0, inputcartid, xicon = "", xclient = ""
            //clone result data
            admin.dataforTag = data.result 
            console.log('getAll() data.result',data.result)
            //=======put header on navtab=========//
            switch(xstatus){
                case "0":
                    document.getElementById('nav-tab').innerHTML = `
                    <button class="nav-link active" id="nav-po-tab" data-bs-toggle="tab" data-bs-target="#nav-po" 
                    type="button" role="tab" aria-controls="nav-po" aria-selected="true">Equipment Details</button>
                    `
                break    
                case "1":
                case "2":
                case "3":
                    document.getElementById('nav-tab').innerHTML = `
                    <button class="nav-link active" id="nav-po-tab" data-bs-toggle="tab" data-bs-target="#nav-po" 
                        type="button" role="tab" aria-controls="nav-po" aria-selected="true">Equipment Details</button>
                    <button class="nav-link" id="nav-client-tab" data-bs-toggle="tab" data-bs-target="#nav-client" 
                        type="button" role="tab" aria-controls="nav-client" aria-selected="false">Client Info</button>
                    `
                break;
            }//end switch
            //============end put header===========//
            //============iterate and display data =======//
            for (let key in data.result) {
                console.log('getAll() iteration',key)
                imgId++;  cartid ++
                switch( xstatus){
                    case "0":  //=========DISPLAY ONHAND ========//
                        xdata = JSON.parse(data.result[key].equipment_value)
                        xprice = data.result[key].price
                        xicon += `
                        <span class=eqptmain>
                        <b>${xdata.equipment_type.toUpperCase()}</b><br>
                        </span>
                        <span class=eqptno><b>
                        ${xdata.eqpt_description}&nbsp;-&nbsp;${data.result[key].qty} ${(data.result[key].qty >1 ? '&nbsp;Units' : 'Unit' )}<br>
                        ${data.result[key].eqpt_no.toUpperCase()}<br></span>
                        <table class='clientelle2' width="70%" >
                        <tr>
                        <td  class=eprice>
                        Serial No.
                        </td>
                        <td>:</td>
                        <td class=eprice>
                         &nbsp;&nbsp;${xdata.serial}
                        </td>
                        </tr>
                        <tr>
                        <td  class=eprice>
                        Condition
                        </td>
                        <td>:</td>
                        <td  class=eprice>
                        &nbsp;&nbsp;${xdata.condition}
                        </td>
                        </tr>
                        <tr>
                        <td  class=eprice>
                        Acquired Price
                        </td>
                        <td>:</td>
                        <td  class=eprice >
                        &nbsp;&nbsp;&#8369;${util.addCommas(parseFloat(data.result[key].price).toFixed(2))}
                        </td>
                        </tr>
                        <tr>
                        <td  class=eprice>
                        Selling Price
                        </td>
                        <td>:</td>
                        <td  class=eprice  >
                        &nbsp;&nbsp;&#8369;${util.addCommas(parseFloat(data.result[key].sale_price).toFixed(2))}
                        </td>
                        </tr>
                        <tr>
                        <td  class=eprice>
                        Total Amount
                        </td>
                        <td>:</td>
                        <td  class=eprice >
                        &nbsp;&nbsp;&#8369;${util.addCommas(parseFloat(data.result[key].total_price).toFixed(2))}
                        </td>
                        </tr>
                        <tr>
                        <td class=eprice>
                        Date Acquired
                        </td>
                        <td>:</td>
                        <td  class=eprice>
                        &nbsp;&nbsp;${xdata.date_reg}
                        </td>
                        </tr>`
                        inputcartid = "qty_"+cartid
                        //<div class="d-sm-flex justify-content-between" >
                        xicon += `<tr>
                            <td colspan=2>
                                <div class="d-sm-flex " >
                                    <button type="button" class="btn btn-primary btn-sm" 
                                    onclick="javascript:admin.addtoCart(
                                        '${inputcartid}',
                                        '${data.result[key].equipment_id}',
                                        '${key}')">
                                    <i class="fa fa-shopping-bag"></i>&nbsp;Add to PO</button>
                                    &nbsp;<br>
                                    <button type="button" class="btn btn-warning btn-sm" 
                                    onclick="javascript:admin.deletePost('${data.result[key].equipment_id}')">
                                    <i class="fa fa-close"></i>&nbsp;Delete</button>
                                </div>
                            </td>
                            <td>
                                <Input id="${inputcartid}" class="form-control cartinput" type='number' onkeydown="return false"
                                min=${(data.result[key].qty == 1 ? '1' : '1' )} 
                                max=${(data.result[key].qty == 1 ? '1' : data.result[key].qty )} 
                                value=${data.result[key].qty}>
                            </td>
                            </tr>
                            <tr>
                            <td colspan=3><hr></td>
                            </tr>
                            </table>`
                        document.getElementById('nav-po').innerHTML = xicon
                    break
                    case "1":
                    case "2":
                    case "3":
                        console.log( 'case=1:2:3 getAll()',data.result[key])
                        
                        ///orig take down nov. 19, 2025 ximage = `assets/resized/${data.result[key].po_number}.jpg`
                        ximage = `https://coral-oyster-704291.hostingersite.com/dr/${data.result[key].po_number}.jpg`

                        let xdet = JSON.parse(JSON.stringify(data.result[key].details))
                        for(let xx in xdet ){//=================next FOR NEXT
                            let xdets = JSON.parse(xdet[xx])
                            //=======PO/ SI HEader =======//
                            xicon += `<span class='eqptno' >
                                <b>PO # ${data.result[key].po_number}  -  INV # ${data.result[key].invoice_number.toUpperCase()}<br>
                                </span>`
                            xicon += `
                                <table width="70%" class='clientelle'>
                                <tr>
                                <td valign=top  >Transaction</td>
                                <td>:</td>
                                <td valign=top >${data.result[key].transaction}</td>
                                </tr>
                                <tr>
                                <td valign=top  >Type </td>
                                <td>:</td>
                                <td valign=top >${xdets.type}</td>
                                </tr>
                                <tr>
                                <td valign=top  >Date Created</td>
                                <td>:</td>
                                <td valign=top >${util.formatDate2(data.result[key].po_date)}</td>
                                </tr>
                                `
                            if(xstatus=="3"){
                                xicon += `
                                 <tr>
                                <td valign=top  >Release Date</td>
                                <td>:</td>
                                <td valign=top >${util.formatDate2(data.result[key].release_date)}</td>
                                </tr>
                                `
                            }
                            xicon +=`
                                <tr>
                                <td valign=top >Eqpt No.</td>
                                <td>:</td>
                                <td valign=top >${data.result[key].eqpt_no}</td>
                                </tr>
                                <tr>
                                <td valign=top >Description</td>
                                <td>:</td>
                                <td valign=top >${xdets.description}</td>
                                </tr>
                                <tr>
                                <td valign=top >Qty</td>
                                <td>:</td>
                                <td valign=top >${xdets.qty}</td>
                                </tr>
                                <tr>
                                <td valign=top >Acquired Price</td>
                                <td>:</td>
                                <td  valign=top align=left>${util.addCommas(xdets.price.toFixed(2))}</td>
                                </tr>
                                <tr>
                                <td valign=top >Selling Price</td>
                                <td>:</td>
                                <td  valign=top align=left>${util.addCommas(xdets.sale.toFixed(2))}</td>
                                </tr>
                                <tr>
                                <td valign=top >Total</td>
                                <td>:</td>
                                <td  valign=top align=left>${util.addCommas(xdets.total.toFixed(2))}</td>
                                </tr>
                                <tr>
                                <td colspan=3><hr></td>
                                </tr>`
                        }//================ end 2ND FOR NEXT
                        xicon +='</table>'
                        /* take out grand total
                        xicon+=`
                            <tr>
                            <td colspan=2 align=left>&nbsp;</td>
                            <td>
                            <span id='gtotal'>${util.addCommas(data.result[key].grand_total.toFixed(2))}</span>
                            </td>
                            </tr>
                            </table>
                        `*/
                        inputcartid = "qty_"+cartid
                        document.getElementById('nav-po').innerHTML = xicon
						//=======PO/ SI HEader =======//
                        xclient += `<span class='eqptno' >
							<b>PO # ${data.result[key].po_number}  -  INV # ${data.result[key].invoice_number.toUpperCase()}<br>
							</span>`
                        xclient += `
                        <table width="70%" class='clientelle'>
                        <tr>
                        <td valign=top  width='25%'>Client : </td>
                        <td valign=top  width='45%'>${data.result[key].client_name}</td>
                        </tr>
                        <tr>
                        <td valign=top >Company : </td>
                        <td valign=top >${data.result[key].client_company}</td>
                        </tr>
                        <tr>
                        <td valign=top >Address : </td>
                        <td valign=top >${data.result[key].client_address}</td>
                        </tr>
                        <tr>
                        <td valign=top >Contact # : </td>
                        <td valign=top >${data.result[key].client_phone}</td>
                        </tr>
                        <tr>
                        <td valign=top >Email : </td>
                        <td valign=top >${data.result[key].client_email.toLowerCase()}</td>
                        </tr>
                        </table>
                        <br>
                        <span class="attach">Remarks:</span><br>
                         ${data.result[key].client_remarks.toUpperCase()}<br>
                        <span class="attach">Attachment:</span><br>
                        <img id="image-${imgId}" class="imgpreview" src="${ximage}" height=80 onclick="javascript:admin.showImage(this.id,this.src)">
                        </span>`
                        xclient+="<hr>"
                        document.getElementById('nav-client').innerHTML = xclient 
                    break
                }
            }//========================== end for loop====================
        })
        .catch((error) => {
            //util.speak(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
        return true
    },
    //===========================addtocart
    addtoCart:async (elemId, eqptId, nKey) =>{
        let qtys = document.getElementById(elemId)
        let adata = admin.dataforTag[nKey].equipment_value
        const badge = document.getElementById('bell-badge')
        //console.log(nKey)
        if(admin.shopCart.length > 0){
            let oFind = admin.shopCart.find( (cart)=> cart.id == eqptId)
            if(oFind === undefined){
                admin.shopCart.push({
                    id: eqptId, 
                    data: adata,
                    qty: qtys.value,
                    price: admin.dataforTag[nKey].price,
                    sale: admin.dataforTag[nKey].sale_price,
                    total: qtys.value * admin.dataforTag[nKey].sale_price
                })
                badge.innerHTML = admin.shopCart.length
                util.speak("Item Successfully Added!",2000)
            }else{
                console.log('present!,...ignore')
                util.speak('THIS ITEM IS ALREADY IN CART!')
                return true;  
            }
        }else{
            admin.shopCart.push({
                id: eqptId, 
                data: adata,
                qty: qtys.value,
                price: admin.dataforTag[nKey].price,
                sale: admin.dataforTag[nKey].sale_price,
                total: qtys.value * admin.dataforTag[nKey].sale_price
            })
            badge.innerHTML = admin.shopCart.length
            util.speak("Item Successfully Added!")
        }
        console.log( '====TOTAL SHOPCART===',admin.shopCart) 
    },
    showCartModal:()=>{
        const configObj = { keyboard: false, backdrop:'static' }
        let pocartmodal =  new bootstrap.Modal(document.getElementById('pocartModal'),configObj);
        let pocartModalEl = document.getElementById('pocartModal')
        if(admin.shopCart.length == 0){
            util.speak('SHOPPING CART EMPTY!')
            e.preventDefault()
            e.stopPropagation()
            return false
        }else{
            admin.showcart()
            pocartmodal.show()
        }//eif
    },
    //======================= show cart
    showcart:() => {
        if(admin.shopCart.length > 0){
            document.getElementById('cart-content').innerHTML = ""
            for (let key in admin.shopCart) {
                const info = JSON.parse(admin.shopCart[key].data)
                document.getElementById('cart-content').innerHTML += `
                <a class="dropdown-item d-flex align-items-center" href="javascript:void(0)">
                <div class="me-3">
                    <div class="bg-primary icon-circle"><i class="fas fa-file-alt text-white"></i></div>
                </div>
                <div>
                <span class=eqptno>
                ${info.equipment_type.toUpperCase()}<br>
                ${info.eqpt_description}<br>
                </span>
                <span class='eqptmain' >
                ${info.serial}<br>
                Qty. ${admin.shopCart[key].qty}<br>
                Price : &#8369;${ util.addCommas(parseFloat(admin.shopCart[key].sale).toFixed(2)) }<br>
                TOTAL : &#8369;${ util.addCommas(parseFloat(admin.shopCart[key].total).toFixed(2)) }<br></span>
                </div>
                </a>`
            }//===========end for next
        } 
    },
    getimagename:()=>{
        document.getElementById('serial_image').value = document.getElementById('client_po').value
    },
    //========CREATE PURCHASE ORDER ==============//
    purchaseOrder:async ()=>{
        util.hideModal('pocartModal',1000)    
        let shopitem =  document.getElementById('shop-item')
        shopitem.innerHTML =""
        let grandtotal = 0
        for (let key in admin.shopCart) {
            const info = JSON.parse(admin.shopCart[key].data)
            grandtotal += parseFloat(admin.shopCart[key].total)
            //console.log('total', grandtotal)
            // document.getElementById('shop-item').innerHTML += `
            // <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
            // <div class="d-flex w-100 justify-content-between">
            //   <h5 class="mb-1">xx ${info.equipment_type.toUpperCase()}</h5>
            // </div>
            // <p class="mb-1">${info.serial}</p>
            // <p class="mb-1">${info.eqpt_description}</p>
            // <p class="mb-1">Qty. ${admin.shopCart[key].qty}</p>
            // <p class="mb-1">Price : &#8369;${ util.addCommas(parseFloat(admin.shopCart[key].sale).toFixed(2)) }</p>
            // <p class="mb-1">TOTAL : &#8369;${ util.addCommas(parseFloat(admin.shopCart[key].total).toFixed(2)) }</p>
            // </a>`
            document.getElementById('shop-item').innerHTML += `
                <div id='itembuy' class='w-100 card shadow'>
                ${info.equipment_type.toUpperCase()}<br>
                ${info.serial}<br>  
                 ${info.eqpt_description}<br>  
                 Qty. ${admin.shopCart[key].qty}<br>  
                 Price : &#8369;${ util.addCommas(parseFloat(admin.shopCart[key].sale).toFixed(2)) }  <br>
                 TOTAL : &#8369;${ util.addCommas(parseFloat(admin.shopCart[key].total).toFixed(2)) }  <br>
                </div>`
        }//===========end for next
        let divrentsale = document.getElementById('div-rent-sale')
        divrentsale.innerHTML='' //reset
        divrentsale.innerHTML=`
            <div class="row">
            <div class="col">
                <label for="client_po">PO Number</label>
                <input onkeyup='javascript:admin.getimagename()' type="text" style="text-transform: uppercase" id="client_po" name="client_po" class="form-control equipmentxx"  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_invoice">Invoice Number</label>
                <input type="text" style="text-transform: uppercase" id="client_invoice" name="client_invoice" class="form-control equipmentxx" value="INV135"  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_transaction">Transaction</label>
                <select class="form-control equipmentxx" id="client_transaction" name="client_transaction" required>
                    <option value="PURCHASE" selected>PURCHASE</option>	
                    <option value="RENT">RENT</option>
					<option value="TERMS">TERMS</option>
				</select>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_name">Client Full Name</label>
                <input type="text" style="text-transform: uppercase" id="client_name" name="client_name" class="form-control equipmentxx" value="ROBERT KENNEDY"  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_name">Company Name</label>
                <input type="text"  style="text-transform: uppercase" id="company_name" name="company_name" class="form-control equipmentxx" value="PREFAB WORKS"  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="delivery_site">Delivery Site</label>
                <input type="text" style="text-transform: uppercase" id="delivery_site" name="delivery_site" class="form-control equipmentxx" value="QC"  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_phone">Company Phone</label>
                <input type="text" id="company_phone" name="company_phone" value="0917-303-1078" placeholder="0917-123-1234" pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_email">Company Email</label>
                <input type="email" style="text-transform: lowercase" id="company_email" name="company_email" value="m@m" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="trucking_name">Trucking</label>
                <input type="text" style="text-transform: uppercase" id="trucking_name" name="trucking_name" value="Vantaztic" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="driver_name">Driver's Name</label>
                <input type="text" style="text-transform: uppercase" id="driver_name" name="driver_name" class="form-control equipmentxx" value="REYGIN CIEZ"  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="plate_number">Plate No.</label>
                <input type="text" style="text-transform: uppercase" id="plate_number" name="plate_number" class="form-control equipmentxx" value="NDM5775"  required/>
            </div>           
            </div>
            <div class="row">
                <div class="col"><BR><br>
                    <span class='grandtotal'>&nbsp;&nbsp;Grand Total :  ${util.addCommas(grandtotal.toFixed(2))}</span>
                    <textarea class="lets-hide" id="post_data" name="post_data">${JSON.stringify(admin.shopCart)}</textarea>
                    <input type="number" min="100" step="0.01" placeholder="0.00" value="${grandtotal}" class="lets-hide form-control equipmentxx" id="grand_total" name="grand_total" required />
                </div>
            </div><br><br>
            <div class="row">
                <div class="col">
                    <label class="form-label " for="client_remarks">Remarks</label>
                    <textarea class="form-control equipmentxx" id="client_remarks" name="client_remarks" rows="4" required>dep slip attched.</textarea>
                </div>  
            </div>
            `
        //=== FOR PO ===//
        document.getElementById('client_po').value = `_${util.generateRandomDigits(5)}`
        document.getElementById('serial_image').value = document.getElementById('client_po').value    
        //=== FOR SALES INVOICE
        document.getElementById('client_invoice').value = `_${util.generateRandomDigits(4)}`
        //==load modal for tagging
        util.loadModals('equipmentTagModal','equipmentTagForm','#equipmentTagForm','equipmentTagPlaceHolder') //PRE-LOAD MODALS)
        util.modalShow('equipmenttagmodal')
    },
    //===========================show modal and iamge
    showImage: async (id,src) => {
        //console.log(id,src)
        const configObj = { keyboard: false, backdrop:'static' }
        let ximagemodal =  new bootstrap.Modal(document.getElementById('imageModal'),configObj);
        let imageModalEl = document.getElementById('imageModal')
        let imageprev = document.getElementById('imagePreview')
        imageprev.src = src
        ximagemodal.show()
        imageModalEl.addEventListener('show.bs.modal', function (event) {
        },false)
    },
    //for badge countr
    fetchBadgeData: async()=>{ //first to fire to update badge
        fetch(`${admin.myIp}/fetchinitdata`).then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            console.log(data)
            //==== update badage for pending approv
            const badge = document.getElementById('bell-badge')
            badge.innerHTML = data.result[2].status_count
            const rentbadge = document.getElementById('rent-badge')
            rentbadge.innerHTML = data.result[0].status_count
            const salebadge = document.getElementById('sale-badge')
            salebadge.innerHTML = data.result[1].status_count
        })
        .catch((error) => {
            util.speak(`Error:,dito nga ${error}`)
            console.error('Error:', error)
        })  
        return true
    },
    filterArr:(cSerial, aArrid, transtype) => {
        //table
        const  tbodyRef = document.getElementById('dataTagTable').getElementsByTagName('tbody')[0];
        tbodyRef.innerHTML="" //RESET FIRST
        let newRow = tbodyRef.insertRow();
        // Insert a cell
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let newArray = admin.dataforTag.filter(function (el)
        {
          return el.equipment_id  == aArrid //return object record if id matched with param ID
        }
        )
        let newVal = JSON.parse(newArray[0].equipment_value)
        ////console.log( newVal)
        //value
        cell1.innerHTML =   `<span class='eqptno' >${newVal.serial}<br>
        ${newVal.equipment_type.toUpperCase()}<br>${newVal.eqpt_description}</span>`
        cell2.innerHTML =   `&#8369;${util.addCommas(parseFloat(newVal.price).toFixed(2))}`
        cell2.style.textAlign = "right"
        cell3.innerHTML =   newVal.date_reg
        let divrentsale = document.getElementById('div-rent-sale')
        divrentsale.innerHTML='' //reset
        //=============template
        if(transtype=="rent"){
            divrentsale.innerHTML=`
            <div class="row">
            <div class="col">
                <label for="client_po">PO Number</label>
                <input type="text" onkeydown='javascript:imagepo()' style="text-transform: uppercase" id="client_po" name="client_po" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_invoice">Invoice Number</label>
                <input type="text" style="text-transform: uppercase" id="client_invoice" name="client_invoice" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_name">Client Full Name</label>
                <input type="text" style="text-transform: uppercase" id="client_name" name="client_name" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_name">Company Name</label>
                <input type="text" style="text-transform: uppercase" id="company_name" name="company_name" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_address">Company Address</label>
                <input type="text" style="text-transform: uppercase" id="company_address" name="company_address" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row"> 
            <div class="col">
                <label for="company_phone">Company Phone</label>
                <input type="text" id="company_phone" name="company_phone" placeholder="0917-123-1234" pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_email">Company Email</label>
                <input type="email" style="text-transform: lowercase" id="company_email" name="company_email" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="rent-price">Rent Price</label>
                <input type="text" id="eqpt_id" name="eqpt_id" value="${aArrid}" class="lets-hide">
                <input type="text" id="trans_type" name="trans_type" value="rent" class="lets-hide">
                <input type="number" step="0.01" placeholder="0.00" class="form-control equipmentxx" id="rent_price" name="rent_price" required  />
            </div>           
            </div>
            <div class="row">
                <div class="col">
                    <label for="rent-start">Rent Start</label>
                    <input type="date" class="form-control equipmentxx" id="rent_start" name="rent_start" required />    
                </div>           
            </div>
            <div class="row">
                <div class="col">
                    <label for="rent-end">Rent End</label>
                    <input type="date" class="form-control equipmentxx" id="rent_end" name="rent_end" required />    
                </div>           
            </div>
            <div class="row">
                <div class="col">
                    <label class="form-label " for="client_remarks">Remarks</label>
                    <textarea class="form-control equipmentxx" id="client_remarks" name="client_remarks" rows="4" required></textarea>
                </div>  
            </div>
            `
        }else{  //==============SALE
            divrentsale.innerHTML=`
            <div class="row">
            <div class="col">
                <label for="client_po">PO Number</label>
                <input type="text" style="text-transform: uppercase" id="client_po" name="client_po" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_invoice">Invoice Number</label>
                <input type="text" style="text-transform: uppercase" id="client_invoice" name="client_invoice" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>            
            <div class="row">
            <div class="col">
                <label for="client_name">Client Full Name</label>
                <input type="text" style="text-transform: uppercase" id="client_name" name="client_name" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_name">Company Name</label>
                <input type="text"  style="text-transform: uppercase" id="company_name" name="company_name" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_address">Company Address</label>
                <input type="text" style="text-transform: uppercase" id="company_address" name="company_address" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_phone">Company Phone</label>
                <input type="text" id="company_phone" name="company_phone" value="" placeholder="0917-123-1234" pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_email">Company Email</label>
                <input type="email" style="text-transform: lowercase" id="company_email" name="company_email" value="" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
                <div class="col">
                    <label for="sale-price">Sale Price</label>
                    <input type="text" id="eqpt_id" name="eqpt_id" value="${aArrid}" class="lets-hide">
                    <input type="text" id="trans_type" name="trans_type" value="sale" class="lets-hide">
                    <input type="number" min=1000 step="0.01" placeholder="0.00" value="9999" class="form-control equipmentxx" id="sale_price" name="sale_price" required />
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label class="form-label " for="client_remarks">Remarks</label>
                    <textarea class="form-control equipmentxx" id="client_remarks" name="client_remarks" rows="4" required></textarea>
                </div>  
            </div>
            `
        }    
        /*
            <div class="row">
            <div class="col">
                <label for="uploaded_file">Sale Price</label>
                <input class="form-control equipmentxx" type="file" name="uploaded_file" id="uploaded_file" accept='image/*' required />
            </div>
            </div>
*/
         //==load modal for tagging
        util.loadModals('equipmentTagModal','equipmentTagForm','#equipmentTagForm','equipmentTagPlaceHolder') //PRE-LOAD MODALS)
	    util.modalShow('equipmenttagmodal')
    },
    //===========OPEN MODAL FOR CATEGORY OF SELECTED EQUIPMENT===========
    showCategory:(cCategory)=>{
        if(cCategory==""){
            return false
        }
        ///console.log('chosen is ', cCategory)
        //off keyboard cofig
        const configObj = { keyboard: false, backdrop:'static' }
        const eqptcatmodal =  new bootstrap.Modal(document.getElementById('equipmentTypeModal'),configObj);
        let eqptcatModalEl = document.getElementById('equipmentTypeModal')
        eqptcatModalEl.addEventListener('hide.bs.modal', function (event) {
            //take away alert
            let cDiv = document.getElementById('equipmentTypePlaceHolder')
            cDiv.innerHTML=""
            // do something...
            //console.log('LOGIN FORM EVENT -> ha?')
        },false)
        document.getElementById('eqpt-label').innerHTML = "Select " + cCategory
        //DOM reference for select
        const categoryType = document.getElementById("categoryType");
        //reset select content
        categoryType.innerHTML = ""
        //get equipment type,
        admin.getEquipment(`${admin.myIp}/getequipment/${cCategory}`, categoryType)
        eqptcatmodal.show() /// show modal box
    },
    removeOptions: (selectElement) => {
        var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
           selectElement.remove(i);
        }
    },
    getEquipment:(url,cSelect)=>{
        fetch(url)
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            //console.log('**data**',data.result[0].equipment_description)  
            admin.removeOptions( cSelect)
            let option = document.createElement("option")
            option.setAttribute('value', "")
            let optionText = document.createTextNode( "-- Pls Select --" )
            option.appendChild(optionText)
            cSelect.appendChild(option)
            for (let key in data.result) {
                let option = document.createElement("option")
                option.setAttribute('value', data.result[key].equipment_description)
                let optionText = document.createTextNode( data.result[key].equipment_description )
                option.appendChild(optionText)
                cSelect.appendChild(option)
            }
            cSelect.focus()
        })
        .catch((error) => {
            util.speak(`Error:, ${error}`)
            console.error('Error:', error)
        })
        return true
    },
    updateEquipment:(optionValue)=>{
        //dom reference
        const eqptdesc = document.getElementById('eqpt_description')
        eqptdesc.value="test"
        eqptdesc.value = optionValue
    },
    //===============filter method
    filterBy:()=>{
        //==========Filter By====
        console.log('==filterBy()===')
        
        let xtype = document.getElementById("filter_type")
        let xstatus = document.getElementById("filter_status")

        console.log( xtype.value, xstatus.value )
        admin.getAll(xtype.value,xstatus.value )
        ///// temporarily out admin.fetchBadgeData()
    },
    //===== get transaction if rent or sale
    getTransact:(ctype)=>{
        const configObj = { keyboard: false, backdrop:'static' }
        const transModal =  new bootstrap.Modal(document.getElementById('msgModal'),configObj);
        const msg = document.getElementById('xmsg4')
        msg.innerHTML = `Are you sure this is for ${ctype.toUpperCase()}?`
        transModal.show()
    },
    //===========for socket.io
    getMsg:()=>{
        admin.socket.on('sales', (oMsg) => {
            let xmsg = JSON.parse(oMsg)
            util.speak( xmsg.msg )
            ///// temporarily out   admin.fetchBadgeData()// update badges
        })
        admin.socket.on('logged', (msg) => {
            util.speak(msg,3000)
            util.clearBox()
            /*
            var item = document.getElementById("xmsg")
            item.textContent = msg
            */
        })
    },
    //===delete wrong entery
    deletePost:(eqptid)=>{
        const url = `${admin.myIp}/getzap/${eqptid}`
        console.log(url)
        fetch(url,{
            cache:'reload'
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            if(data.status){
                util.speak( data.voice )
            }else{
                return false
            }
        })
        .catch((error) => {
            //util.speak(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })
        console.log('==deletePost()')
        admin.getAll( document.getElementById('filter_type').value,document.getElementById('filter_status').value)
        return true
    },
	//==,= main run
	init : async () => {
        util.speak( util.getCookie('the_voice'))
        
        console.log( 'loading admin.init()....')
        let authz = []
        authz.push(util.getCookie('grp_id' ))
        authz.push(util.getCookie('fname'))
        //==HANDSHAKE FIRST WITH SOCKET.IO
        const userName = { token : authz[1] , mode: 1}//full name token

        admin.socket = io.connect(`${admin.myIp}`, {
            //withCredentials: true,
            transports: ['websocket', 'polling'], // Same as server
            upgrade: true, // Ensure WebSocket upgrade is attempted
            rememberTransport: false, //Don't keep transport after refresh
            query:`userName=${JSON.stringify(userName)}`
            // extraHeaders: {
            //   "osndp-header": "osndp"
            // }
        });//========================initiate socket handshake ================

        // admin.socket.on('logged', (msg) => {
        //     console.log('socket.io()',msg)
        //  })

        admin.socket.on('connect', () => {
            console.log('Connected to Socket.IO server using:', admin.socket.io.engine.transport.name); // Check the transport
        });

        admin.socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        //write name
        const xname = document.getElementById('xname')
        const xpic = document.getElementById('xpic')
        //get name of logged user
        xname.innerHTML = util.getCookie('fname')
        xpic.src = util.getCookie('pic')
        const ipaddy = document.getElementById('ip')
        ipaddy.innerHTML = util.getCookie('ip_addy')
        
        
        util.loadModals('equipmentModal','equipmentForm','#equipmentForm','equipmentPlaceHolder') //PRE-LOAD MODALS
        ////util.speak('System Ready', 2000)
        //// temporarily out    admin.fetchBadgeData()
        console.log('First getMsg()')
        admin.getMsg()


        //============FORM SUBMIT LISTENER==========================//
        //util.js will call this after upload-btn.click()
        const frmupload = document.getElementById('uploadForm')
        frmupload.addEventListener("submit", e => {
            const formx = e.target;
            fetch(`${admin.myIp}/postimage`, {
                method: 'POST',
                body: new FormData(formx),
                })
                .then( (response) => {
                    return response.json() // if the response is a JSON object
                })
                .then( (data) =>{
                    console.log ('postimage() value=> ', data )
                    console.log('*****TAPOS NA PO IMAGE POST*****')
                    util.hideModal('equipmentTagModal',2000)//then close form    
                    admin.filterBy()
                })
                    // Handle the success response object
                .catch( (error) => {
                    console.log(error) // Handle the error response object
                });
            //e.preventDefault()
            console.log('===ADMIN ATTACHMENT JPEG FORM SUBMITTTTT===')
                //// keep this reference for event listener and getting value
                /////const eqptdesc = document.getElementById('eqpt_description')
                ////eqptdesc.value =  e.target.value
            // Prevent the default form submit
            e.preventDefault();    
        })
        //=================END FORM SUBMIT==========================//
        //proxy property
        //admin.test
        
        console.log('Second getAll()')
        console.log(document.getElementById('filter_type').value,document.getElementById('filter_status').value)
        admin.getAll( document.getElementById('filter_type').value,document.getElementById('filter_status').value)
      
	}//END MAIN
} //======================= end admin obj==========//
//admin.Bubbl
window.scrollTo(0,0);
admin.init()
