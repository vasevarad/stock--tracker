import React, {Fragment, useState } from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { updateMoney, loadQuote, addStock } from '../../actions/auth';
import { setAlert } from '../../actions/alert';



const Dashboard = ({auth, updateMoney, setAlert, loadQuote}) => {

    const [formData, setFormData] = useState({
        addMoney: '',
        removeMoney: '',
        buyStockName:'',
        buyQuantity:'',
        sellStockName:'',
        sellQuantity:''
    });


    const {addMoney, removeMoney, buyStockName, buyQuantity, sellQuantity, sellStockName} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const onAddMoney = async e => {
        e.preventDefault();
        //addMoney.clear();
        setFormData({...formData, addMoney: "Money to be added"});
        updateMoney(auth.user.email, addMoney);
    }

    const onRemoveMoney = async e => {
        e.preventDefault();
        setFormData({...formData, removeMoney: "Money to be removed"});
        updateMoney(auth.user.email, -removeMoney);
    }


    const onBuy = async e => {
      e.preventDefault();
      //addMoney.clear();
      await loadQuote(String(buyStockName));
      setFormData({...formData, buyStockName: "", buyQuantity: 0})
      if(!auth.price){
        setAlert("Error fetching quote, check the stock details!", 'danger', 50000);
      }
      else if(auth.user.balance <= 0 || (auth.price * buyQuantity) < auth.user.balance){
        setAlert("You do not have enough balance. Please add some money!", 'danger', 50000);
      }
      else{
        const quote = auth.price * buyQuantity;
        setAlert("$" + quote +"will be deducted", 'success', 50000);
        setFormData({...formData, buyStockName: "", buyQuantity: 0});
        addStock(auth.user.email, buyStockName, buyQuantity, quote);
       // updateMoney(auth.user.email, -quote);
      }
      
  }

  const onSell = async e => {
    e.preventDefault();
    //addMoney.clear();
    await loadQuote(String(sellStockName));
    setFormData({...formData, sellStockName: "", buyQuantity: 0})
    if(!auth.price){
      setAlert("Error fetching quote, check the stock details!", 'danger', 50000);
    }

    else{
      const quote = auth.price * sellQuantity;
      setAlert("$" + quote +"will be added", 'success', 50000);
      setFormData({...formData, sellStockName: "", sellQuantity: 0});
      addStock(auth.user.email, sellStockName, sellQuantity, quote);
     // updateMoney(auth.user.email, -quote);
    }
    
}

    

    return (
        <Fragment>
            <section className="container">
      <h1 className="large text-primary">
        Dashboard
      </h1>
      <p className="lead"><i className="fas fa-user"></i> Welcome {auth.user && auth.user.name }</p>
      
      <h2 className="my-2">Current Balance: ${auth.user && auth.user.balance }</h2>
      
      <div className="dash-buttons">

      <div className="form-group">
          <input type="text" placeholder="Money to be added" name="addMoney" pattern="[0-9]*" value={addMoney} type="number" onChange={e => onChange(e)}  />
        </div>   <div input type="click" className="btn btn-light" onClick={e => onAddMoney(e)}><i className="fas fa-money-bill-alt text-primary"></i> Add Money </div>
       </div>
    

       <div className="dash-buttons">

       <div className="form-group">
          <input type="text" placeholder="Money to be removed" name="removeMoney" pattern="[0-9]*" value={removeMoney} type="number" onChange={e => onChange(e)}  />
        </div>
       <div input type="click" className="btn btn-light" onClick={e => onRemoveMoney(e)}><i className="fas fa-money-bill-alt text-primary"></i> Remove Money </div>
             
      </div>

      <h2 className="my-2">Current Share Holdings </h2>
      
      <table className="table">
        <thead>
          <tr>
            <th>Share</th>
            <th className="hide-sm">Quantity</th>
          </tr>
        </thead>
 
        



      </table>

      <h2 className="my-2">Buy stocks </h2>

      <form className="form" onSubmit={e => onBuy(e)}>
        <div className="form-group">
          <input type="text" placeholder="Enter a stock name. E.g.: GOOG, MSFT etc." name="buyStockName" value={buyStockName} onChange={e => onChange(e)} required />
        </div>
      
        <div className="form-group">
          <input type="text" placeholder="0" name="buyQuantity" value={buyQuantity} onChange={e => onChange(e)} required />
        </div>
      <div className="dash-buttons">
        <div input type="click" className="btn btn-light" onClick={e => onBuy(e)}>Execute Buy</div>
        </div>
        </form>

        <h2 className="my-2">Sell stocks </h2>
      
        <form className="form" onSubmit={e => onRemoveMoney(e)}>
        <div className="form-group">
          <input type="text" placeholder="Enter a stock name. E.g.: GOOG, MSFT etc." name="sellStockName" value={sellStockName} onChange={e => onChange(e)} required />
        </div>
      
        <div className="form-group">
          <input type="text" placeholder="0" name="sellQuantity" value={sellQuantity} onChange={e => onChange(e)} required />
        </div>
      <div className="dash-buttons">
        <div input type="click" className="btn btn-light" onClick={e => onRemoveMoney(e)}>Execute Sell</div>
        </div>
        </form>

      
        </section>
    </Fragment>
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    updateMoney: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    loadQuote: PropTypes.func.isRequired,
    price: PropTypes.object.isRequired

};

const mapStateToProps = state => ({
    auth: state.auth,
    price: state.price
})

export default connect( mapStateToProps, 
    { setAlert, updateMoney, loadQuote })(Dashboard);
