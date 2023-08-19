exports.isloggin = async(req,res,next)=>{
    try {
        if(req.session.admin_id){
            next()
        }
        else{
            res.redirect('/admin')
        }
        
    } catch (error) {
        console.log();
    }
}
exports.issignout = async(req,res,next)=>{
 
    try {
        if(req.session.admin_id){
            res.redirect('/admin/Dashboard')
        }
        else{
            next()
        }
        

    } catch (error) {
        console.log(error.messaage);
    }
}