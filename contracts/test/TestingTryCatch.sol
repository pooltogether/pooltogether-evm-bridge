pragma solidity 0.6.0;

contract Test{

    function i() internal{

    }

    function e() external {
        try this.i(){

        }
        catch{

        }

    }


}