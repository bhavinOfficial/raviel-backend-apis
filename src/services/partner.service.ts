import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import partnerRepository from "../repositories/partner.repository";
import xlsx from "xlsx";
import fs from "fs";


const partnerService = {
  partnerAddSellersViaForm: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.body.sellerId, req.user.id);

    if (seller) return message.SELLER_ALREADY_EXIST;

    const dataToCreate = {
      ...req.body,
      partnerId: req.user.id
    };

    const createdSelller = await partnerRepository.partnerAddSellersViaForm(dataToCreate);

    if (!createdSelller) return message.FAILED;

    return createdSelller;
  },

  updateSellerAddedByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.params.sellerId, req.user.id);

    if (!seller) return message.SELLER_NOT_FOUND;

    const updatedSelller = await partnerRepository.updateSellerAddedByPartner(req.body, req.params.sellerId);

    if (!updatedSelller) return message.FAILED;

    return updatedSelller;
  },

  deleteSellerAddedByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.params.sellerId, req.user.id);

    if (!seller) return message.SELLER_NOT_FOUND;

    const deletedSelller = await partnerRepository.deleteSellerAddedByPartner(req.params.sellerId);

    if (!deletedSelller) return message.FAILED;

    return deletedSelller;
  },

  fetchSellerAddedByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.params.sellerId, req.user.id);

    if (!seller) return message.SELLER_NOT_FOUND;

    const encryptedPassword = helper.encrypt(seller.password)

    seller.password = encryptedPassword;

    return seller;
  },

  fetchAllSellersAddedByPartner: async (req: any) => {
    let sellersData = await partnerRepository.fetchAllSellersAddedByPartner(req.user.id);

    sellersData = sellersData.map((seller: any) => ({
      ...seller,
      password: helper.encrypt(seller.password)
    }));

    return sellersData;
  },

  addSellersByPartnerUsingFile: async (req: any) => {

    if (!req.file) {
      return "Please provide a excel file to upload data!"
    }

    const filePath = req.file.path;

    let eventsData: any[] = [];

    let workBook: xlsx.WorkBook;

    if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      workBook = xlsx.readFile(filePath);
    } else if (req.file.mimetype === "text/csv") {
      const csvBuffer = fs.readFileSync(filePath, { encoding: "utf8" });
      workBook = xlsx.read(csvBuffer, { type: "string" });
    } else {
      return "Unsupported file format. Please upload an XLSX or CSV file.";
    }


    const sheetName = workBook.SheetNames[0];

    const sheet = workBook.Sheets[sheetName];

    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    if (!data.length) {
      return "No data found in the uploaded file!";
    }


    const ifEmptySpaceAvailableInData = data.find((item: any) => Object.keys(item).some((key: string) => key.includes("__EMPTY_")));


    if (!ifEmptySpaceAvailableInData) {
      eventsData = data;
    } else {
      eventsData = data.map((item: any) => {
        const emptyKeyNames = Object.keys(item);
        return {
          sellerId: item[emptyKeyNames[0]],
          sellerName: item[emptyKeyNames[1]],
          brandName: item[emptyKeyNames[2]],
          launchingDate: item[emptyKeyNames[3]],
          listingDate: item[emptyKeyNames[4]],
          sellerEmailId: item[emptyKeyNames[5]],
          phoneNumber: item[emptyKeyNames[6]],
          password: item[emptyKeyNames[7]],
          brandApproval: item[emptyKeyNames[8]],
          gstNumber: item[emptyKeyNames[9]],
          trademarkClass: item[emptyKeyNames[10]],
          productCategories: item[emptyKeyNames[11]],
        };
      }).filter((_, index) => index > 0);
    }


    eventsData = eventsData.map((event: any) => {
      if (event.launchingDate) {
        // If Excel date is stored as a number (Excel serial date)
        if (typeof event.launchingDate === 'number') {
          // Convert Excel serial date to JavaScript Date
          // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
          event.launchingDate = new Date((event.launchingDate - 25569) * 86400 * 1000);
        }
        // If date is already in string format like '2023-05-15T14:30:00'
        else if (typeof event.launchingDate === 'string') {
          event.launchingDate = new Date(event.launchingDate);
        }
      }
      if (event.listingDate) {
        // If Excel date is stored as a number (Excel serial date)
        if (typeof event.listingDate === 'number') {
          // Convert Excel serial date to JavaScript Date
          // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
          event.listingDate = new Date((event.listingDate - 25569) * 86400 * 1000);
        }
        // If date is already in string format like '2023-05-15T14:30:00'
        else if (typeof event.listingDate === 'string') {
          event.listingDate = new Date(event.listingDate);
        }
      }
      if (event.phoneNumber) {
        event.phoneNumber = event.phoneNumber.toString();
      }
      if (event.productCategories) {
        event.productCategories = event.productCategories.split(",").map((item: any) => item.trim());
      }
      return {
        ...event,
        partnerId: req.user.id
      };
    });

    const errorDatas: any = [];

    eventsData.map((event: any) => {
      if (event.phoneNumber) {
        if (!/^\d{10}$/.test((event?.phoneNumber))) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Phone number is Invalid(not 10 digit number)!"
          });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(event?.sellerEmailId)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid Email!"
          });
        }

        const gstRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        if (!gstRegex.test(event?.gstNumber)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid GST Number!"
          });
        }
        
        const validBrandApprovalStatuses = ["pending", "approved"];
        
        if (!validBrandApprovalStatuses.includes(event.brandApproval)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid Brand Approval status!"
          });
        }

        const validTrademarkClassStatuses = ["pending", "approved"];

        if (!validTrademarkClassStatuses.includes(event.trademarkClass)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid trademark class status!"
          });
        }
        
        const validProductCategories = ["clothing", "electronics", "cosmetics"];
        
        const notValidProductCategories = event.productCategories.some((pc: any) => !validProductCategories.includes(pc))
        
        if (notValidProductCategories) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid product categories!"
          });
        }
      }
    });

    const sellerIdsToExtract: any = [];

    if (errorDatas.length) {
      // return "Invalid data found in the uploaded file!"
      errorDatas.map((errorData: any) => {
        sellerIdsToExtract.push(errorData.sellerId);
      });
    }

    if (sellerIdsToExtract.length) {
      eventsData = eventsData.filter((event) => !sellerIdsToExtract.includes(event?.sellerId));
    }

    let sellersData = await partnerRepository.addSellersByPartnerUsingFile(eventsData);

    if (!sellersData) return message.FAILED;

    return {
      errorDatas,
      sellerAddedWithValidData: (sellersData.map((seller: any) => seller.get({ plain: true }))).length
    };
  },

};

export default partnerService;
