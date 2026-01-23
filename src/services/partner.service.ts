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

  confirmSellerPayment: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.params.sellerId, req.user.id);

    if (!seller) return message.SELLER_NOT_FOUND;

    const dataToUpdate: any = {};

    if (req.body.paymentType === "Fixed") {
      dataToUpdate.fixedPaymentReceivedOrNot = req.body.isPaymentReceivedOrNot;

      const amount = seller?.fixedPaymentAmount || 0;

      const delta = req.body.isPaymentReceivedOrNot ? amount : -amount;

      const updatedUserInfo = await userRepository.updateUser({
        totalFixedPayment: Number(req.user.totalFixedPayment) + delta,
        finalPayout: Number(req.user.finalPayout) + delta,
      }, req.user?.id);
      if (!updatedUserInfo) return message.FAILED;
    }

    if (req.body.paymentType === "NMV") {
      dataToUpdate.NMVPaymentReceivedOrNot = req.body.isPaymentReceivedOrNot;

      const amount = seller?.NMVPaymentAmount || 0;

      const delta = req.body.isPaymentReceivedOrNot ? amount : -amount;
      
      const updatedUserInfo = await userRepository.updateUser({
        totalNMVPayment:  Number(req.user.totalNMVPayment) + delta,
        finalPayout: Number(req.user.finalPayout) + delta,
      }, req.user?.id);
      if (!updatedUserInfo) return message.FAILED;
    }

    const updatedSelller = await partnerRepository.updateSellerAddedByPartner(dataToUpdate, req.params.sellerId);

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
    let sellersData = await partnerRepository.fetchAllSellersAddedByPartner(req);

    sellersData = sellersData.map((seller: any) => ({
      ...seller,
      password: helper.encrypt(seller.password)
    }));

    return sellersData;
  },


  fetchAllOrdersByPartner: async (req: any) => {
    const ordersData = await partnerRepository.fetchAllOrdersByPartner(req);

    if (!ordersData) return message.FAILED;

    return ordersData;
  },

  addSellersByPartnerUsingFile: async (req: any) => {

    if (!req.file) {
      return "Please provide a excel or csv file to upload data!"
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

        const validProductCategories = ["Fashion", "Footwear", "Home & Kitchen", "Electronics", "Grocery", "Beauty", "Sports", "Toys", "Automobile", "Furniture", "Jewelry", "Books & Stationery", "Industrial & Scientific", "Pet Supplies", "Medical & Healthcare"];

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

    eventsData = eventsData.filter((event) => event.sellerId !== "DEMO12");


    let sellersData = await partnerRepository.createOrUpdateBulkSellers(eventsData);

    if (!sellersData) return message.FAILED;

    return {
      errorDatas,
      sellerAddedWithValidData: (sellersData.map((seller: any) => seller.get({ plain: true }))).length
    };
  },

  uploadTimelineDataManagementFile: async (req: any) => {

    if (!req.file) {
      return "Please provide a excel or csv file to upload data!"
    }

    const validTimlineKeys = ["daily", "monthly", "weekly"];
    const timelineDataTenure = "timeline-data-tenure";

    if (!validTimlineKeys.includes(req.body?.[timelineDataTenure])) {
      return "timeline-data-tenure must be one of: daily, monthly or weekly"
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

    if (req.body?.["timeline-data-tenure"] === "daily") {


      if (!ifEmptySpaceAvailableInData) {
        eventsData = data;
      } else {
        eventsData = data.map((item: any) => {
          const emptyKeyNames = Object.keys(item);
          return {
            "Seller ID": item[emptyKeyNames[0]],
            "Seller Name": item[emptyKeyNames[1]],
            "Seller Status": item[emptyKeyNames[2]],
            "Seller Email ID": item[emptyKeyNames[3]],
            "Partner Name": item[emptyKeyNames[4]],
            "Partner Email ID": item[emptyKeyNames[5]],
            "Launch Date": item[emptyKeyNames[6]],
            "Order Created Date": item[emptyKeyNames[7]],
            "Order ID": item[emptyKeyNames[8]],
            "Shipment ID": item[emptyKeyNames[9]],
            "Delivery AWB No": item[emptyKeyNames[10]],
            "Shipment Status": item[emptyKeyNames[11]],
            "Order Type": item[emptyKeyNames[12]],
            "Order Value": item[emptyKeyNames[13]],
            "Delivery Partner": item[emptyKeyNames[14]],
            "Mode Of Payment": item[emptyKeyNames[15]],
            "First Seller Order": item[emptyKeyNames[16]],
            "Order Schedule for Pickup": item[emptyKeyNames[17]],
            "Order Shipped": item[emptyKeyNames[18]],
            "Order Cancelled By Seller": item[emptyKeyNames[19]],
            "Order Auto Cancelled": item[emptyKeyNames[20]],
            "Order Cancelled By Customer": item[emptyKeyNames[21]],
            "Reverse Shipment ID": item[emptyKeyNames[22]],
            "RTO AWB No": item[emptyKeyNames[23]],
            "Reverse Shipment Status": item[emptyKeyNames[24]]
          };
        }).filter((_, index) => index > 0);
      }

      const sellerIdsfromFile: any = [];

      eventsData.map((event: any) => {
        sellerIdsfromFile.push(event?.["Seller ID"])
      });

      const uniqueSellerIdsfromFile: any = [...new Set(sellerIdsfromFile)]

      const findAllSellers = (await partnerRepository.fetchAllSellersBySellerIds(uniqueSellerIdsfromFile)).map((seller: any) => seller?.sellerId);

      const sellerIDsNotInDB = uniqueSellerIdsfromFile.filter((seller: any) => !findAllSellers.includes(seller))

      if (sellerIDsNotInDB.length) {
        return `You haven't added these sellers: ${sellerIDsNotInDB}! So you are requested to add these sellers first then retry to upload file!`;
      }

      eventsData = eventsData.map((event) => helper.trimKeysAndValuesOfObject(event));

      if (!eventsData.find((event: any) => Object.keys(event).includes("Shipment ID"))) {
        return "Invalid file uploaded, you are requested to upload daily file here!";
      }

      eventsData = eventsData.map((event: any) => {
        const orderCreatedDate = "Order Created Date";
        const launchingDate = "Launch Date";

        if (event && event?.[orderCreatedDate]) {
          // If Excel date is stored as a number (Excel serial date)
          if (typeof event?.[orderCreatedDate] === 'number') {
            // Convert Excel serial date to JavaScript Date
            // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
            event[orderCreatedDate] = new Date((event?.[orderCreatedDate] - 25569) * 86400 * 1000);
          }
          // If date is already in string format like '2023-05-15T14:30:00'
          else if (typeof event?.[orderCreatedDate] === 'string') {
            event[orderCreatedDate] = new Date(event?.[orderCreatedDate]);
          }
        }
        if (event && event?.[launchingDate]) {
          // If Excel date is stored as a number (Excel serial date)
          if (typeof event?.[launchingDate] === 'number') {
            // Convert Excel serial date to JavaScript Date
            // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
            event[launchingDate] = new Date((event?.[launchingDate] - 25569) * 86400 * 1000);
          }
          // If date is already in string format like '2023-05-15T14:30:00'
          else if (typeof event?.[launchingDate] === 'string') {
            event[launchingDate] = new Date(event?.[launchingDate]);
          }
        }
        return event;
      });

      // const sellerDataSingular: any = {};

      // for (const event of eventsData) {
      //   if (!event?.["Seller ID"]) continue;

      //   if (!sellerDataSingular[event?.["Seller ID"]]) {
      //     sellerDataSingular[event?.["Seller ID"]] = {};
      //   }

      //   sellerDataSingular[event?.["Seller ID"]] = {
      //     sellerId: event?.["Seller ID"],
      //     sellerName: event?.["Seller Name                               "],
      //     sellerStatus: (event?.["Seller Status"])?.toLowerCase(),
      //     sellerEmailId: event?.["Seller Email ID"],
      //   };
      // }

      // for (const data of Object.entries(sellerDataSingular)) {
      //   const updateSeller = await partnerRepository.updateSellerAddedByPartner(data?.[1], data?.[0]);
      // }


      const uniqueMap = new Map<string, any>();

      for (const seller of eventsData) {
        uniqueMap.set(seller?.["Seller ID"], {
          sellerId: seller?.["Seller ID"],
          sellerName: seller?.["Seller Name"],
          sellerStatus: (seller?.["Seller Status"])?.toLowerCase(),
          sellerEmailId: seller?.["Seller Email ID"],
          launchingDate: seller?.["Launch Date"],
          partnerId: req.user?.id
        });
      }

      const finalData = Array.from(uniqueMap.values());

      // const dummyData = [{
      //   sellerId: 'D77EE7',
      //   sellerName: 'John Doe',
      //   sellerStatus: 'active',
      //   sellerEmailId: 'john123@example.com',
      //   launchingDate: "2025-06-14",
      //   partnerId: req.user?.id
      // }]


      let sellersData = await partnerRepository.createOrUpdateBulkSellers(finalData);


      let senitizedOrdersData = eventsData.map((event: any) => {
        return {
          sellerId: event?.["Seller ID"],
          orderCreatedDate: event?.["Order Created Date"],
          orderId: event?.["Order ID"],
          shipmentId: event?.["Shipment ID"],
          shipmentStatus: event?.["Shipment Status"],
          orderValue: event?.["Order Value"],
          deliveryPartner: event?.["Delivery Partner"] ?? "",
          modeOfPayment: event?.["Mode Of Payment"],
          orderShipped: event?.["Order Shipped"],
        }

      });

      // const orderIdCountMap = new Map<string, number>();

      // for (const row of senitizedOrdersData) {
      //   if (!row.orderId) continue;

      //   orderIdCountMap.set(
      //     row.orderId,
      //     (orderIdCountMap.get(row.orderId) || 0) + 1
      //   );
      // }

      // const duplicateOrderIds = Array.from(orderIdCountMap.entries())
      //   .filter(([_, count]) => count > 1)
      //   .map(([orderId, count]) => ({ orderId, count }));

      // ------   shipment duplicate -----


      const shipmentIdCountMap = new Map<string, number>();

      for (const row of senitizedOrdersData) {
        const findField = "orderId"; // shipmentId
        if (!row?.[findField]) continue;

        shipmentIdCountMap.set(
          row?.[findField],
          (shipmentIdCountMap.get(row?.[findField]) || 0) + 1
        );
      }

      const duplicateshipmentIds = Array.from(shipmentIdCountMap.entries())
        .filter(([_, count]) => count > 1)
        .map(([findField, count]) => ({ findField, count }));

      // function dedupeJioMartRows(rows) {
      const uniqueOrdersMap = new Map();

      for (const row of senitizedOrdersData) {
        const key = `${row.sellerId}|${row.orderId}|${row.shipmentId}`;

        // last occurrence wins (latest status)
        uniqueOrdersMap.set(key, row);
      }

      const finalUniqueOrders = Array.from(uniqueOrdersMap.values());
      // }


      // -------- shipment end -----



      // const uniqueMap = new Map();

      // for (const row of senitizedOrdersData) {
      //   const key = `${row.sellerId}_${row.orderCreatedDate}`;
      //   uniqueMap.set(key, row); // last one wins
      // }

      // const dedupedData = Array.from(uniqueMap.values());

      const addedOrders = await partnerRepository.sellerOrdersAddedByPartnerUsingFile(finalUniqueOrders);

      if (!addedOrders) {
        return message.FAILED;
      }

      return true;
    }



    if (req.body?.["timeline-data-tenure"] === "weekly") {


      if (!ifEmptySpaceAvailableInData) {
        eventsData = data;
      } else {
        eventsData = data.map((item: any) => {
          const emptyKeyNames = Object.keys(item);
          return {
            "Seller ID": item[emptyKeyNames[0]],
            "Seller Name": item[emptyKeyNames[1]],
            "Account Email Id": item[emptyKeyNames[2]],
            "Seller State": item[emptyKeyNames[3]],
            "Partner Name": item[emptyKeyNames[4]],
            "Partner Email Id": item[emptyKeyNames[5]],
            "Regsitered Date": item[emptyKeyNames[6]],
            "Launch Date": item[emptyKeyNames[7]],
            "Dominant L1 At Launch": item[emptyKeyNames[8]],
            "First Order Seller Cancelled ": item[emptyKeyNames[9]],
            "First 10 Order Cancellation Seller": item[emptyKeyNames[10]],
            "SKU At Launch": item[emptyKeyNames[11]],
            "Current SKU Live": item[emptyKeyNames[12]],
            "Seller Cancelled Order": item[emptyKeyNames[13]],
            "Auto Cancelled Orders": item[emptyKeyNames[14]],
            "Total Cancelled Orders": item[emptyKeyNames[15]],
            "Total Orders": item[emptyKeyNames[16]],
            "First 10 Order Cancellation Seller Count": item[emptyKeyNames[17]],

          };
        }).filter((_, index) => index > 0);
      }

      const sellerIdsfromFile: any = [];

      eventsData.map((event: any) => {
        sellerIdsfromFile.push(event?.["Seller ID"])
      });

      const uniqueSellerIdsfromFile: any = [...new Set(sellerIdsfromFile)]

      uniqueSellerIdsfromFile.push("D77EE7");

      const findAllSellers = (await partnerRepository.fetchAllSellersBySellerIds(uniqueSellerIdsfromFile)).map((seller: any) => seller?.sellerId);

      const sellerIDsNotInDB = uniqueSellerIdsfromFile.filter((seller: any) => !findAllSellers.includes(seller))

      if (sellerIDsNotInDB.length) {
        return `You haven't added these sellers: ${sellerIDsNotInDB}! So you are requested to add these sellers first then retry to upload file!`;
      }

      eventsData = eventsData.map((event) => helper.trimKeysAndValuesOfObject(event));

      if (!eventsData.find((event: any) => Object.keys(event).includes("Dominant L1 At Launch"))) {
        return "Invalid file uploaded, you are requested to upload weekly file here!";
      }


      eventsData = eventsData.map((event: any) => {
        const registeredDate = "Regsitered Date";

        if (event && event?.[registeredDate]) {
          // If Excel date is stored as a number (Excel serial date)
          if (typeof event?.[registeredDate] === 'number') {
            // Convert Excel serial date to JavaScript Date
            // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
            event[registeredDate] = new Date((event?.[registeredDate] - 25569) * 86400 * 1000);
          }
          // If date is already in string format like '2023-05-15T14:30:00'
          else if (typeof event?.[registeredDate] === 'string') {
            event[registeredDate] = new Date(event?.[registeredDate]);
          }
        }
        return event;
      });


      // const orderIdCountMap = new Map<string, number>();

      // for (const row of eventsData) {
      //   if (!row?.["Seller ID"]) continue;

      //   orderIdCountMap.set(
      //     row?.["Seller ID"],
      //     (orderIdCountMap.get(row?.["Seller ID"]) || 0) + 1
      //   );
      // }

      // const duplicateOrderIds = Array.from(orderIdCountMap.entries())
      //   .filter(([_, count]) => count > 1)
      //   .map(([orderId, count]) => ({ orderId, count }));


      const sanitizedSellers = eventsData.map((row: any) => ({
        sellerId: row["Seller ID"],
        sellerName: row["Seller Name"],
        sellerEmailId: row["Account Email Id"]?.trim(),
        sellerStatus: row["Seller State"]?.toLowerCase(),
        launchingDate: row["Regsitered Date"],
        dominantL1AtLaunch: row["Dominant L1 At Launch"]?.trim() ?? "",
        SKUsAtLaunch: row["SKU At Launch"] ?? 0,
        currentSKUsLive: row["Current SKU Live"] ?? 0,
        partnerId: req.user?.id

      }));


      const uniqueMap = new Map<string, any>();

      for (const seller of sanitizedSellers) {
        uniqueMap.set(seller?.sellerId, seller);
      }

      const finalData = Array.from(uniqueMap.values());

      let sellersData = await partnerRepository.createOrUpdateBulkSellers(finalData);

      return true;
    }

    if (req.body?.["timeline-data-tenure"] === "monthly") {


      if (!ifEmptySpaceAvailableInData) {
        eventsData = data;
      } else {
        eventsData = data.map((item: any) => {
          const emptyKeyNames = Object.keys(item);
          return {
            "Seller ID": item[emptyKeyNames[0]],
            "Seller Name": item[emptyKeyNames[1]],
            "Launch Date": item[emptyKeyNames[7]],
            "Account Email Id": item[emptyKeyNames[2]],
            "Partner Name": item[emptyKeyNames[4]],
            "Partner Email Id": item[emptyKeyNames[5]],
            "Payout-Type": item[emptyKeyNames[5]],
            "Current SKU Live": item[emptyKeyNames[12]],
            "First Order Seller Cancelled Penalty": item[emptyKeyNames[5]],
            "Eligible for Payout": item[emptyKeyNames[5]],
            "NMV Slab/ Fixed Slab": item[emptyKeyNames[5]],
            "Total Payout": item[emptyKeyNames[5]],
          };
        }).filter((_, index) => index > 0);
      }

      // const sellerIdsfromFile: any = [];

      // eventsData.map((event: any) => {
      //   sellerIdsfromFile.push(event?.["Seller ID"])
      // });

      // const uniqueSellerIdsfromFile: any = [...new Set(sellerIdsfromFile)]

      // uniqueSellerIdsfromFile.push("D77EE7");

      // const findAllSellers = (await partnerRepository.fetchAllSellersBySellerIds(uniqueSellerIdsfromFile)).map((seller: any) => seller?.sellerId);

      // const sellerIDsNotInDB = uniqueSellerIdsfromFile.filter((seller: any) => !findAllSellers.includes(seller))

      // if (sellerIDsNotInDB.length) {
      //   return `You haven't added these sellers: ${sellerIDsNotInDB}! So you are requested to add these sellers first then retry to upload file!`;
      // }

      eventsData = eventsData.map((event) => helper.trimKeysAndValuesOfObject(event));

      if (!eventsData.find((event: any) => Object.keys(event).includes("Total Payout"))) {
        return "Invalid file uploaded, you are requested to upload monthly file here!";
      }


      function getFirstDateOfMonth(date: Date): Date {
        // return new Date(date.getFullYear(), date.getMonth(), 1);
        return new Date(Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          1 // first day
        ));
      }

      function getNMVMonth(date: Date): Date {
        // return new Date(date.getFullYear(), date.getMonth() + 2, 1);
        return new Date(Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth() + 2, // +2 months
          1 // first day
        ));
      }



      eventsData = eventsData.map((event: any) => {
        const launchDate = "Launch Date";

        if (event && event?.[launchDate]) {
          // If Excel date is stored as a number (Excel serial date)
          if (typeof event?.[launchDate] === 'number') {
            // Convert Excel serial date to JavaScript Date
            // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
            event[launchDate] = new Date((event?.[launchDate] - 25569) * 86400 * 1000);
          }
          // If date is already in string format like '2023-05-15T14:30:00'
          else if (typeof event?.[launchDate] === 'string') {
            event[launchDate] = new Date(event?.[launchDate]);
          }
        }
        return event;
      });

      // const orderIdCountMap = new Map<string, number>();

      // for (const row of eventsData) {
      //   if (!row?.["Seller ID"]) continue;

      //   orderIdCountMap.set(
      //     row?.["Seller ID"],
      //     (orderIdCountMap.get(row?.["Seller ID"]) || 0) + 1
      //   );
      // }

      // const duplicateOrderIds = Array.from(orderIdCountMap.entries())
      //   .filter(([_, count]) => count > 1)
      //   .map(([orderId, count]) => ({ orderId, count }));

      const sanitizedSellers = eventsData.map((row: any) => ({
        sellerId: row?.["Seller ID"],
        sellerName: row?.["Seller Name"],
        sellerEmailId: row?.["Account Email Id"]?.trim(),
        launchingDate: row?.["Launch Date"],
        ...(!isNaN(row?.["Current SKU Live"]) && { currentSKUsLive: row?.["Current SKU Live"] ?? 0 }),
        ...(row?.["Payout-Type"].includes("NMV") ? { NMVPaymentAmount: row?.["Total Payout"], NMVPaymentMonthYear: getNMVMonth(row?.["Launch Date"]) } : row?.["Payout-Type"].includes("Fixed") ? { fixedPaymentAmount: row?.["Total Payout"], fixedPaymentMonthYear: getFirstDateOfMonth(row?.["Launch Date"]) } : null),
        partnerId: req.user?.id,
      }));

      // const uniqueMap = new Map<string, any>();

      // for (const seller of sanitizedSellers) {
      //   uniqueMap.set(seller?.sellerId, seller);
      // }

      // const finalData = Array.from(uniqueMap.values());

      let sellersData = await partnerRepository.createOrUpdateBulkSellers(sanitizedSellers);

      if (!sellersData) {
        return message.FAILED;
      }

      return true;
    }
  },

};

export default partnerService;
