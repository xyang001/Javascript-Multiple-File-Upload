/**
 *  @author : Didin Nurdin Ahmadi
 *  Release : 07-04-2011
 *  Bugs :
 *    - Masalah hanya di IE (tested IE 8) 
 *    - FF, Chrome, Safari (fine) Opera (not tested)
 *    - untuk IE harus dengan tags langsung, sebaiknya tidak dengan DOM
 *    - Supaya submiting data dengan IE berhasil, dibutuhkan satu object input "submit" dan object ini harus menjadi trigger untuk submitting data
 *    - IE Form dalam form tidak diizinkan dan memang itu W3C standart nya gitoo :p    
 *     
 */
function upload(dest_id,options){    
    if(typeof window._upload_i == 'undefined'){
        window._upload_i = parseInt(options.startFrom) || 1;
    }else {    
        window._upload_i++;
    }
    
    var ops = $.extend({
                  loader : 'Loading',
                  message_extension : 'Format file yang dibolehkan',
                  text_label: "Upload Foto",
                  success_loader : '',
                  max : 10, 
                  url : null, 
                  extension: 'jpg|jpeg', 
                  success : function(){},
                  data : {},
                  beforeUpload : function(){},
                  name  : 'foto',
                  nameId : 'form-file-' + window._upload_i + '-$i',
                  nameSubmit : 'form-file-submit-' + window._upload_i + '-$i',
                  formId : 'form-upload-' + window._upload_i + '-$i',
                  frameId : 'form-frame-upload-' + window._upload_i + '-$i',
                  labelId : 'form-label-' + window._upload_i + '-$i',
                  spanId : 'form-upload-loader-' + window._upload_i + '-$i' ,
                  startForm : null
              },options);      		    
    var i = 1;       
    return {               
           create : function(){
                if(ops.max >= i){
                    var self = this;
                    var form = {};//document.createElement('form');
                        form = $.extend(form,{
                                  enctype : 'multipart/form-data',
                                  action  : ops.url,
                                  method  : 'POST',
                                  id      : ops.formId.replace('$i',i),
                                  target  : ops.frameId.replace('$i',i),
                                  name    : i,
                                  trigger : ops.nameSubmit.replace('$i',i),
                                  fileId  : ops.nameId.replace('$i',i),
                                  spanId  : ops.spanId.replace('$i',i)
                               });
                    var iframe= {} ;//document.createElement('iframe');
                        iframe= $.extend(iframe,{
                                    name  : form.target,
                                    id    : form.target,
                                    src   : form.action,
                                    frameborder:'0px',                                        
                                    width :'0',
                                    height:'0',
                                    executed : false,
                                    success  : false 
                                });
                        $(iframe).css({width:0,height:0,border:0});
                    var html = '<form action="'+ form.action +'" method="post" id="'+ form.id +'" enctype="multipart/form-data" target="'+ form.target +'">' + 
                               '<iframe style="width:0px;height:0px;border:0px;" name="'+ form.target +'" id="'+ iframe.name +'"></iframe>' + 
                               '<p>';
                        for(var dk in ops.data){
                            html += '<input type="hidden" name="' + dk + '" value="'+ ops.data[dk] +'" />';
                        }
                        html+= '<label for="'+ ops.labelId.replace('$i',i) +'">' + ops.text_label + '</label><br />' +
                               '<input type="file" name="'+ ops.name +'" id="'+ form.fileId +'" class="trigger_uploader" /><span id="'+ ops.spanId.replace('$i',i) +'" style="font-size:20px;display:inline;"></span>' + 
                               '<input type="submit" id="'+ form.trigger +'" name="submit['+ i + ']" value="Submit" style="display:none;" />';
                        html+= '</p>' + 
                               '</form>';                    
                    $(dest_id).append(html);
                    $('#'+ ops.nameId.replace('$i',i)).bind('change',function(){
                        var test = new RegExp(ops.extension + '$');
                        if(!test.test( $(this).val() )){
                          alert(ops.message_extension +  ops.extension.replace('|',', '));
                          return false;
                        }                       
                                                
                        $('#'+ form.trigger).bind('click',function(){
                            iframe.success = false;                                                        
                            $('#' + form.spanId).html( ops.loader );
                            $('#' + form.target).bind('load',function(){
                                $('#' + form.spanId).html(ops.success_loader);
                                var response = document.getElementById(form.target).contentWindow.document.body.innerHTML;
                                if(iframe.success == false){
                                  ops.success.call(ops,response,form.id,form.name,window._upload_i);
                                  iframe.success = true;
                                }                                    
                                if(iframe.executed == false){
                                  self.create();
                                  iframe.executed = true;
                                }                                                           
                            });
                        }).click();
                    });                  
                }
                i++; 
           },
    };
    
}
