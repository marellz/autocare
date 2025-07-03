import { Request, Response, NextFunction } from "express";
import { RequestStatus, RequestStatusEnum } from "../db/models/request.model";
// import RequestService from "../services/request/request.service";
import VendorService from "../services/vendor/vendor.service";
import { Vendor } from "../db/models/vendor.model";
import InteractionService from "../services/interaction/interaction.service";
import moment from "moment";
import { FindAttributeOptions, Op, Sequelize } from "sequelize";
import { RequestModel, VendorModel, VendorRequestModel } from "../db/sequelize";
import { VendorRequestStatusEnum } from "../db/models/vendorRequest.model";

interface ChartData {
  month: string;
  requests: number;
  quotes: number;
}

const getChartData = async (months: number = 6): Promise<ChartData[]> => {
  const indexOfMonth = moment().month();
  const monthsArray = moment.monthsShort();
  const _months = monthsArray.splice(0, indexOfMonth + 1);
  const today = moment();
  const startDate = today
    .clone()
    .subtract(months - 1, "months")
    .startOf("month");
  const endDate = today.clone().endOf("month");
  const createdAt = {
    [Op.gte]: startDate.toISOString(),
    [Op.lte]: endDate.toISOString(),
  };
  const attributes = [
    [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), "month"],
    [Sequelize.fn("count", "*"), "count"],
  ] as FindAttributeOptions;

  const requests = await RequestModel.findAll({
    where: {
      createdAt,
      status: {
        [Op.in]: [
          RequestStatusEnum.PENDING,
          RequestStatusEnum.SUBMITTED,
          RequestStatusEnum.COMPLETED,
        ] as RequestStatus[],
      },
    },
    attributes,
    group: ["month"],
    raw: true,
  });

  const vendorRequests = await VendorRequestModel.findAll({
    where: {
      createdAt,
      status: {
        [Op.in]: [
          VendorRequestStatusEnum.PROPOSED,
          VendorRequestStatusEnum.QUOTED,
        ],
      },
    },
    attributes,
    group: ["month"],
    raw: true,
  });

  return _months.map((month, i) => ({
    month,
    requests: (requests[i] as any)?.count || 0,
    quotes: (vendorRequests[i] as any)?.count || 0,
  }));
};

const getNewRquests = async (limit: number = 5) => {
  return await RequestModel.findAll({
    limit,
    where: {
      status: {
        [Op.in]: [
          RequestStatusEnum.PENDING,
          RequestStatusEnum.SUBMITTED,
          RequestStatusEnum.COMPLETED,
        ],
      },
    },
  });
};

const getQuotedRequestsCount = async () => {
  return await VendorRequestModel.findAndCountAll({
    where: {
      status: {
        [Op.in]: [
          VendorRequestStatusEnum.PROPOSED,
          VendorRequestStatusEnum.QUOTED,
        ],
      },
    },
  });
};

class DashboardController {
  static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const uniqueInteractions =
        await InteractionService.findAllUniqueInteractions();

      const newRequests = await getNewRquests(5);
      const topVendors: Vendor[] = await VendorService.getTopVendors();
      const chartData = await getChartData(6);
      const quoteQuery = await getQuotedRequestsCount();
      const lastSyncedAt = moment().zone("+03:00").format('hh:mm A'

      )
      const data = {
        stats: {
          vendors: await VendorModel.count(),
          requests: await RequestModel.count(),
          quotes: quoteQuery.count,
          uniqueInteractions: uniqueInteractions.length,
        },
        newRequests,
        topVendors,
        chartData,
        lastSyncedAt
      };

      res.json({
        message: "ok",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default DashboardController;
